// Write your "projects" router here!
const express = require('express');

const Project = require('../projects/projects-model')
const router = express.Router();

router.use((req, res, next) => {
    console.log('in the project router');
    next();
});

router.get('/', (req, res) => {
    Project.get()
    .then(user => {
      res.status(200).json(user);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'Error retrieving the project',
      });
    });
  });

  router.get('/:id', validateProjectId, (req, res) => {
    Project.get(req.params.id)
    .then(actions => {
    res.status(200).json(actions)
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({
      message: 'Error getting the project by id',
    });
  });
})

router.get('/:id/actions', (req, res) => {
    Project.getProjectActions(req.params.id)
    .then(actions => {
    res.status(200).json(actions)
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({
      message: 'Error getting the project by id',
    });
  });
})

router.post('/', validateProject, (req, res) => {
    Project.insert(req.body)
    .then(project => {
      res.status(201).json(project);
    })
    .catch(err => {
      res.status(500).json({message: "Error adding a project", err});
    })
});

router.put('/:id', validateProjectId, validateProject, (req, res) => {
    Project.update(req.params.id, req.body)
  .then(project => {
    res.status(200).json(project.name);
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({message: 'There was an error updating project'})
  })
});

router.delete('/:id', validateProjectId, (req, res) => {
    Project.remove(req.params.id)
    .then(count => {
    res.status(200).json({ message: `${count} account deleted: ${req.project.name}`})
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({
      message: 'Error removing the project',
    });
  });
});




function validateProjectId(req, res, next) {
    const { id } = req.params;
    Project.get(id)
    .then(project => {
      if(project) {
        req.project = project;
        next(); 
      } else {
        next({code: 404, message: "Invalid user ID"}); 
      }
    })
    .catch(err => {
      console.log(err);
      next({code: 500, message: "Failed to process request", err});
    })
  }
  
  
  
  
  
  function validateProject(req, res, next) {
   
    if(req.body) {
      if(req.body.name && req.body.description) {
        next();
      } else {
        next({code: 400, message: "Missing required name field"});
      }
    } else {
      next({code: 400, message: "Missing user data", user: req.body});
    }
  }
  
//   function validateProjectPost(req, res, next) {
//     if(req.body && Object.keys(req.body).length > 0) {
//       if(req.body.text) {
//         next();
//       } else {
//         next({code: 404, message: "Please include text"});
//       }
//     } else {
//       next({code: 404, message: "Please include a request body"});
//       // res.status(500).json({message: 'please include a request body'})
//     }
//   };



module.exports = router;