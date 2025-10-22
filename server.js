const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/workflows', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'workflows.html'));
});

app.get('/documentation', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'documentation.html'));
});

// API endpoint for contact form
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;

    // In a real application, you would save this to a database
    // or send an email notification
    console.log('Contact form submission:', { name, email, message });

    res.json({
        success: true,
        message: 'Thank you for your message! We will get back to you soon.'
    });
});

// API endpoint for workflow examples
app.get('/api/workflows', (req, res) => {
    const workflows = [
        {
            id: 1,
            title: 'Customer Service Automation',
            description: 'Automatically route and respond to customer inquiries using AI',
            category: 'Customer Support',
            complexity: 'Medium',
            estimatedTime: '2-3 hours'
        },
        {
            id: 2,
            title: 'Content Generation Pipeline',
            description: 'Generate blog posts and social media content automatically',
            category: 'Marketing',
            complexity: 'Easy',
            estimatedTime: '1-2 hours'
        },
        {
            id: 3,
            title: 'Document Processing',
            description: 'Extract and analyze data from PDFs and images using OCR and AI',
            category: 'Operations',
            complexity: 'Hard',
            estimatedTime: '4-5 hours'
        },
        {
            id: 4,
            title: 'Lead Qualification',
            description: 'Score and route leads automatically based on AI analysis',
            category: 'Sales',
            complexity: 'Medium',
            estimatedTime: '2-3 hours'
        },
        {
            id: 5,
            title: 'Sentiment Analysis',
            description: 'Monitor customer feedback and alert on negative sentiment',
            category: 'Customer Support',
            complexity: 'Easy',
            estimatedTime: '1-2 hours'
        },
        {
            id: 6,
            title: 'Invoice Processing',
            description: 'Automatically extract, validate, and process invoices',
            category: 'Finance',
            complexity: 'Hard',
            estimatedTime: '4-6 hours'
        }
    ];

    res.json(workflows);
});

// API endpoint for getting started guide
app.get('/api/guide', (req, res) => {
    const guide = {
        steps: [
            {
                step: 1,
                title: 'Install n8n',
                description: 'Set up n8n using Docker, npm, or desktop application',
                commands: [
                    'docker run -it --rm --name n8n -p 5678:5678 -v ~/.n8n:/home/node/.n8n n8nio/n8n',
                    'npm install n8n -g && n8n start'
                ]
            },
            {
                step: 2,
                title: 'Create Your First Workflow',
                description: 'Start with a simple webhook trigger and HTTP response',
                tips: ['Use the manual trigger for testing', 'Add error handling early']
            },
            {
                step: 3,
                title: 'Integrate AI Services',
                description: 'Connect OpenAI, Anthropic, or other AI providers',
                requirements: ['API key', 'Understanding of prompts', 'Rate limits awareness']
            },
            {
                step: 4,
                title: 'Test and Deploy',
                description: 'Test thoroughly before production deployment',
                checklist: ['Error scenarios', 'Edge cases', 'Performance', 'Costs']
            }
        ]
    };

    res.json(guide);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: err.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`AI Automation server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
