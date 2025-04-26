const { Issue } = require('../models/Issue');
const { Response } = require('../models/Response');
const { GHUser } = require('../models/GHUser');
const { ObjectId } = require('mongodb');
const { validationResult } = require('express-validator');
const { Wallet } = require('../models/Wallet');

const create = async (req, res) => {
  try {
    if (ObjectId.isValid(req.user._id) && /^[a-zA-Z0-9-]{1,39}$/.test(req.user.github_id.id)) {
      const hey = await GHUser.findOne({ '_id': req.user._id });
      if (hey) {
        return res.status(200).render('main.hbs', {
          layout: 'create.hbs',
          _id: req.user._id,
          github_id: req.user.github_id.id,
          repo_links: req.user.repos
        });
      } else {
        return res.status(403).redirect('/error?error_details=Not_Allowed');
      }
    } else {
      return res.status(403).redirect('/error?error_details=Not_Allowed');
    }
  } catch {
    return res.status(500).redirect('/error?error_details=Error_Occurred');
  }
};

const save = async (req, res) => {
  try {
    const error = validationResult(req);
    if (error.isEmpty()) {
      const { contact_info, skillset, repo_link, description } = req.body;
      const regex = /^[a-zA-Z0-9_]+$/;
      const checker = regex.test(req.user.username);
      if (checker) {
        const check = await Issue.findOne({ repo_link: repo_link });
        if (check === null) {
          const trial = new Issue({
            username: req.user.username,
            contact_info: contact_info,
            skillset: skillset.toLowerCase(),
            github_id: req.user.github_id.id,
            repo_link: repo_link,
            description: description,
            createdBy: req.user._id
          });
          await trial.save();
          return res.status(201).redirect('/api/user');
        } else {
          return res.status(403).redirect('/error?error_details=Query_Already_Exists');
        }
      } else {
        return res.status(400).redirect('/error?error_details=Invalid_URL');
      }
    }
    return res.send('Oops! Error Occurred...');
  } catch {
    return res.status(500).redirect('/error?error_details=Error_Occurred');
  }
};

const list = async (req, res) => {
  try {
    const regex = /^[a-zA-Z0-9_]+$/;
    const checker = regex.test(req.user.username);
    if (checker) {
      const issues = await Issue.find({ username: req.user.username }).lean().exec();
      const wallet = await Wallet.findOne({ userID: req.user._id });
      return res.status(200).render('main.hbs', {
        layout: 'issues.hbs',
        issues: issues,
        walletAddress: wallet.walletAddress
      });
    } else {
      return res.status(400).redirect('/error?error_details=Invalid_URL');
    }
  } catch {
    return res.status(500).redirect('/error?error_details=Error_Occurred');
  }
};

const save_response = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const { issue_id, creator } = req.body;
      const regex = /^[a-zA-Z0-9_]+$/;
      const checker = regex.test(req.user.username);
      if (creator.toString() !== req.user._id.toString() && ObjectId.isValid(issue_id) && ObjectId.isValid(req.user._id) && checker) {
        const resp_check = await Response.findOne({ 'responder.uid': req.user._id, 'issue': issue_id });
        if (resp_check === null) {
          const response_ = new Response({
            responder: {
              username: req.user.username,
              uid: req.user._id,
              github_id: req.user.github_id.id
            },
            issue: issue_id,
            creator: creator,
            approved: false
          });
          await response_.save();
          return res.status(201).redirect(`/home/view?_id=${issue_id}`);
        } else {
          return res.status(403).redirect('/error?error_details=Already_Responded');
        }
      } else {
        return res.status(403).redirect('/error?error_details=Not_Allowed');
      }
    }
    return res.send('Oops! Error Occurred...');
  } catch {
    return res.status(500).redirect('/error?error_details=Error_Occurred');
  }
};

const tracker = async (req, res) => {
  try {
    if (ObjectId.isValid(req.user._id)) {
      const responses = await Response.find({ 'responder.uid': req.user._id, 'approved': true, $nor: [{ 'status': 'Accepted' }, { 'status': 'Not Approved' }] });
      const tasks = [];
      for (const response of responses) {
        const issue_id = response.issue;
        const creator = response.creator;
        const assignedAt = response.updatedAt;
        const status = response.status;

        const issue = await Issue.findById(issue_id);
        const assignedBy = await GHUser.findById(creator);
        const repository = issue.repo_link;
        const taskId = response._id;

        if (!issue || !assignedBy) {
          continue;
        }

        const task = {
          assigned_by: {
            username: assignedBy.username,
            github_id: assignedBy.github_id.id
          },
          description: issue.description,
          assigned_at: assignedAt,
          repository_link: repository,
          status: status,
          taskId: taskId,
          deadline: response.deadline
        };

        tasks.push(task);
      }
      return res.status(200).render('main.hbs', {
        layout: 'tasks.hbs',
        tasks: tasks
      });
    } else {
      return res.status(403).redirect('/error?error_details=Not_Allowed');
    }
  } catch {
    return res.status(500).redirect('/error?error_details=Error_Occurred');
  }
};

const taskStatusUpdate = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const taskId = req.params.id;
      if (ObjectId.isValid(taskId) && ObjectId.isValid(req.user._id)) {
        const resp_check = await Response.findOne({ 'responder.uid': req.user._id, '_id': taskId });
        if (resp_check) {
          switch (resp_check.status) {
          case 'To Do':
            await Response.findByIdAndUpdate(taskId, { status: 'Working' });
            break;
          case 'Working':
            await Response.findByIdAndUpdate(taskId, { status: 'Completed' });
            break;
          default:
            return res.status(403).redirect('/error?error_details=Invalid_Status_Transition_Encountered');
          }
          return res.status(201).redirect('/query/track');
        } else {
          return res.status(404).redirect('/error?error_details=Task_Not_Found');
        }
      } else {
        return res.status(403).redirect('/error?error_details=Not_Allowed');
      }
    }
    return res.send('Oops! Error Occurred...');
  } catch {
    return res.status(500).redirect('/error?error_details=Error_Occurred');
  }
};

const reviewer = async (req, res) => {
  try {
    if (ObjectId.isValid(req.user._id)) {
      const responses = await Response.find({ 'creator': req.user._id, 'approved': true, $nor: [{ 'status': 'Accepted' }, { 'status': 'Not Approved' }] });
      const tasks = [];
      for (const response of responses) {
        const issue_id = response.issue;
        const responder = response.responder.uid;
        const assignedAt = response.updatedAt;
        const status = response.status;

        const issue = await Issue.findById(issue_id);
        const assignedTo = await GHUser.findById(responder);
        const repository = issue.repo_link;
        const taskId = response._id;

        if (!issue || !assignedTo) {
          continue;
        }

        const task = {
          assigned_to: {
            username: assignedTo.username,
            github_id: assignedTo.github_id.id
          },
          description: issue.description,
          assigned_at: assignedAt,
          repository_link: repository,
          status: status,
          taskId: taskId,
          deadline: response.deadline
        };

        tasks.push(task);
      }
      return res.status(200).render('main.hbs', {
        layout: 'review_tasks.hbs',
        tasks: tasks
      });
    } else {
      return res.status(403).redirect('/error?error_details=Not_Allowed');
    }
  } catch {
    return res.status(500).redirect('/error?error_details=Error_Occurred');
  }
};

const responseUpdate = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const taskId = req.params.id;
      const action = req.params.action;
      if (ObjectId.isValid(taskId) && ObjectId.isValid(req.user._id)) {
        const resp_check = await Response.findOne({ 'creator': req.user._id, '_id': taskId });
        if (resp_check) {
          let responder;
          switch (action) {
          case 'accept':
            await Response.findByIdAndUpdate(taskId, { status: 'Accepted' });
            responder = await GHUser.findById(resp_check.responder.uid);
            if (responder) {
              if (resp_check.deadline) {
                const deadlineDate = new Date(resp_check.deadline);
                const currentDate = new Date();

                let points;

                // Award 100 points if within deadline, else 50 points
                if (currentDate <= deadlineDate) {
                  const issue = await Issue.findById(resp_check.issue);
                  if (issue.priority === 1) {
                    points = 200;
                  } else {
                    points = 100;
                  }
                } else {
                  points = 50;
                }

                await GHUser.findByIdAndUpdate(resp_check.responder.uid, {
                  $inc: { total_points: points, balance: points }
                });
              } else {
                // Default to 50 points if no deadline exists
                await GHUser.findByIdAndUpdate(resp_check.responder.uid, {
                  $inc: { total_points: 50, balance: 50 }
                });
              }
            } else {
              return res.status(404).redirect('/error?error_details=Responder_Not_Found');
            }
            break;
          case 'reject':
            await Response.findByIdAndUpdate(taskId, { status: 'To Do' });
            break;
          default:
            return res.status(403).redirect('/error?error_details=Invalid_Status_Transition_Encountered');
          }
          return res.status(201).redirect('/query/review');
        } else {
          return res.status(404).redirect('/error?error_details=Task_Not_Found');
        }
      } else {
        return res.status(403).redirect('/error?error_details=Not_Allowed');
      }
    }
    return res.send('Oops! Error Occurred...');
  } catch {
    return res.status(500).redirect('/error?error_details=Error_Occurred');
  }
};

const profileUpdater = async (req, res) => {
  try {
    const { username, email, github } = req.body;
    const updates = {};

    if (username !== req.user.username) {
      const unavailable = await GHUser.findOne({ username });
      if (unavailable) return res.status(403).redirect('/error?error_details=Username_Unavailable');

      await Issue.updateMany({ createdBy: req.user._id }, { username });
      await Response.updateMany({ 'responder.uid': req.user._id }, { 'responder.username': username });
      updates.username = username;
    }

    if (email !== req.user.email.address) {
      const unavailable = await GHUser.findOne({ 'email.address': email });
      if (unavailable) return res.status(403).redirect('/error?error_details=Email_Unavailable');
      updates.email = { address: email, verified: false };
      updates.verified = false;
    }

    if (github !== req.user.github_id.id) {
      const unavailable = await GHUser.findOne({ 'github_id.id': github });
      if (unavailable) return res.status(403).redirect('/error?error_details=GitHub_ID_Unavailable');

      const userRepos = req.user.repos;
      const issues = await Issue.find({ repo_link: { $in: userRepos } });
      await Response.updateMany({ 'responder.uid': req.user._id }, { 'responder.github_id': github });

      for (const issue of issues) {
        await Response.updateMany({ 'issue': issue._id, status: 'Accepted' }, { extra: { ...issue, unavailable: true } }).lean().exec();
        await Response.deleteMany({ 'issue': issue._id, status: { $nin: ['Accepted'] } }).lean().exec();
        await Issue.findOneAndDelete({ '_id': issue._id });
      }

      updates.github_id = { id: github, verified: false };
      updates.verified = false;
      updates.repos = [];
    }

    if (Object.keys(updates).length > 0) {
      await GHUser.findByIdAndUpdate(req.user._id, updates);
    }

    // return console.log(updated, updates, req.user, req.body);
    return res.status(201).redirect('/api/user');
  } catch {
    return res.status(500).redirect('/error?error_details=Error_Occurred');
  }
};


module.exports = { create, save, list, save_response, tracker, taskStatusUpdate, reviewer, responseUpdate, profileUpdater };