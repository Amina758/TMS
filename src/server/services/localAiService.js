/**
 * Local AI Service for generating task descriptions without external API
 */

// Templates for different types of tasks
const taskTemplates = {
  // Project-related templates
  project: [
    "This project involves planning, organizing, and executing all necessary steps to achieve the defined objectives. You'll need to identify key stakeholders, establish timelines, and monitor progress throughout the implementation phase.",
    "For this project, you'll need to develop a comprehensive plan that outlines scope, resources, timeline, and deliverables. Regular progress tracking and stakeholder communication will be essential for success.",
    "This project requires careful coordination of resources, clear communication with team members, and attention to detail. Breaking it down into manageable phases will help ensure successful completion."
  ],
  
  // Development-related templates
  development: [
    "This development task requires writing clean, maintainable code according to project standards. You'll need to implement the required functionality, write appropriate tests, and document your work.",
    "For this development work, you'll need to analyze requirements, design an efficient solution, and implement it with proper error handling and edge case management. Code reviews and testing will be essential.",
    "This coding task involves implementing the specified functionality while ensuring compatibility with existing systems. Follow best practices for code organization, testing, and documentation."
  ],
  
  // Design-related templates
  design: [
    "This design task requires creating visually appealing and user-friendly interfaces that align with brand guidelines. Consider user experience principles and gather feedback throughout the process.",
    "For this design work, you'll need to understand user needs, create wireframes, and develop high-fidelity mockups. Iterative refinement based on stakeholder feedback will be important.",
    "This design assignment involves creating intuitive and accessible interfaces that solve user problems effectively. Research, sketching, prototyping, and user testing should be part of your process."
  ],
  
  // Research-related templates
  research: [
    "This research task involves gathering information from reliable sources, analyzing findings, and presenting insights in a clear, actionable format. Document your methodology and key discoveries.",
    "For this research work, you'll need to define clear objectives, select appropriate research methods, collect and analyze data, and draw meaningful conclusions to inform decision-making.",
    "This investigation requires systematic information gathering, critical analysis, and synthesis of findings. Maintain organized records of your sources and document your process."
  ],
  
  // Meeting-related templates
  meeting: [
    "This meeting requires preparation of an agenda, facilitation of discussion, and documentation of key decisions and action items. Ensure all relevant stakeholders are invited and prepared.",
    "For this meeting, you'll need to define clear objectives, prepare necessary materials, manage time effectively, and follow up with minutes and action items.",
    "This gathering involves bringing together key stakeholders to discuss important matters, make decisions, and align on next steps. Preparation and follow-up are essential for effectiveness."
  ],
  
  // Generic templates for any task type
  generic: [
    "This task requires careful planning, execution, and attention to detail. Break it down into smaller steps, establish a timeline, and track your progress to ensure successful completion.",
    "For this task, you'll need to identify the key objectives, determine necessary resources, create an action plan, and execute methodically while monitoring progress and adjusting as needed.",
    "This assignment involves understanding requirements, planning your approach, executing with quality in mind, and reviewing your work before submission. Communication with stakeholders is important throughout the process."
  ]
};

// Keywords to identify task types
const taskTypeKeywords = {
  project: ['project', 'initiative', 'program', 'launch', 'implement', 'rollout', 'deployment'],
  development: ['develop', 'code', 'program', 'implement', 'build', 'create', 'software', 'app', 'application', 'website', 'feature', 'bug', 'fix', 'debug'],
  design: ['design', 'create', 'mockup', 'wireframe', 'prototype', 'UI', 'UX', 'interface', 'visual', 'graphic', 'layout'],
  research: ['research', 'investigate', 'analyze', 'study', 'survey', 'explore', 'review', 'evaluate', 'assess'],
  meeting: ['meeting', 'call', 'discussion', 'conference', 'workshop', 'session', 'sync', 'standup', 'review', 'retrospective', 'planning']
};

// Additional details to make descriptions more specific
const additionalDetails = {
  timeframe: [
    "This should be completed within a reasonable timeframe, with regular progress updates.",
    "Consider breaking this down into phases with specific deadlines for each milestone.",
    "This is a high-priority task that requires immediate attention and timely completion.",
    "This is a longer-term initiative that should be approached methodically with sustainable pacing."
  ],
  collaboration: [
    "Collaboration with team members will be essential for successful completion.",
    "This task may require cross-functional coordination to ensure all perspectives are considered.",
    "Regular communication with stakeholders will help ensure alignment and satisfaction with outcomes.",
    "This can be completed independently, but periodic check-ins are recommended to ensure alignment."
  ],
  quality: [
    "Focus on delivering high-quality results that meet or exceed expectations.",
    "Attention to detail is critical for this task to ensure accuracy and completeness.",
    "Balance speed and quality appropriately, with emphasis on a polished final deliverable.",
    "Document your process and decisions to ensure knowledge transfer and future reference."
  ]
};

/**
 * Identifies the most likely task type based on the title
 * @param {string} title - The task title
 * @returns {string} - The identified task type
 */
function identifyTaskType(title) {
  const lowerTitle = title.toLowerCase();
  
  // Check each task type's keywords
  for (const [type, keywords] of Object.entries(taskTypeKeywords)) {
    for (const keyword of keywords) {
      if (lowerTitle.includes(keyword)) {
        return type;
      }
    }
  }
  
  // Default to generic if no specific type is identified
  return 'generic';
}

/**
 * Generates a task description based on the title
 * @param {string} title - The task title
 * @returns {string} - The generated description
 */
function generateTaskDescription(title) {
  // Identify task type
  const taskType = identifyTaskType(title);
  
  // Select a random template for the identified task type
  const templates = taskTemplates[taskType];
  const baseTemplate = templates[Math.floor(Math.random() * templates.length)];
  
  // Add some additional details for more variety
  const timeframeDetail = additionalDetails.timeframe[Math.floor(Math.random() * additionalDetails.timeframe.length)];
  const collaborationDetail = additionalDetails.collaboration[Math.floor(Math.random() * additionalDetails.collaboration.length)];
  const qualityDetail = additionalDetails.quality[Math.floor(Math.random() * additionalDetails.quality.length)];
  
  // Combine the template and details
  const description = `${baseTemplate} ${timeframeDetail} ${collaborationDetail} ${qualityDetail}`;
  
  return description;
}

module.exports = {
  generateTaskDescription
};
