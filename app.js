'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const errorhandler = require('errorhandler');
const path = require('path');
const serverless = require('serverless-http');
const routes = require('./routes');
const activity = require('./routes/activity');

const app = express();

// CORS Configuration
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

if (app.get('env') === 'development') {
    app.use(errorhandler());
}

// Default routes
app.get('/', routes.index);
app.post('/', activity.execute);
app.post('/login', routes.login);
app.post('/logout', routes.logout);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});

// Journey Builder Endpoints
app.post('/journeybuilder/save', activity.save);
app.post('/journeybuilder/validate', activity.validate);
app.post('/journeybuilder/publish', activity.publish);
app.post('/journeybuilder/execute', activity.execute);
app.post('/journeybuilder/edit', activity.edit);
app.post('/journeybuilder/stop', activity.stop);

app.post('/save', activity.save);
app.post('/validate', activity.validate);
app.post('/publish', activity.publish);
app.post('/execute', activity.execute);
app.post('/edit', activity.edit);
app.post('/stop', activity.stop);

app.post('/test-endpoint', activity.testEndpoint);
app.get('/debug-log', activity.debugLog);

app.use(errorhandler());

// Export for AWS Lambda
module.exports.handler = serverless(app);
