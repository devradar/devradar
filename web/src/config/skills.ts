import type { Skill } from '@/types'

const SKILLS_CONFIG = [
  {
    name: 'React',
    slug: 'react',
    description: 'A JavaScript library for building user interfaces.',
    reference_url: 'https://react.dev',
    category_name: 'Frameworks'
  },
  {
    name: 'Vue',
    slug: 'vue',
    description: 'The Progressive JavaScript Framework.',
    reference_url: 'https://vuejs.org',
    category_name: 'Frameworks'
  },
  {
    name: 'Angular',
    slug: 'angular',
    description: 'Platform for building mobile and desktop web applications.',
    reference_url: 'https://angular.io',
    category_name: 'Frameworks'
  },
  {
    name: 'Svelte',
    slug: 'svelte',
    description: 'Cybernetically enhanced web apps.',
    reference_url: 'https://svelte.dev',
    category_name: 'Frameworks'
  },
  {
    name: 'Next.js',
    slug: 'nextjs',
    description: 'The React Framework for Production.',
    reference_url: 'https://nextjs.org',
    category_name: 'Frameworks'
  },
  {
    name: 'TypeScript',
    slug: 'typescript',
    description: 'JavaScript with syntax for types.',
    reference_url: 'https://www.typescriptlang.org',
    category_name: 'Languages & Tools'
  },
  {
    name: 'JavaScript',
    slug: 'javascript',
    description: 'The programming language of the Web.',
    reference_url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    category_name: 'Languages & Tools'
  },
  {
    name: 'Python',
    slug: 'python',
    description: 'A programming language that lets you work quickly.',
    reference_url: 'https://www.python.org',
    category_name: 'Languages & Tools'
  },
  {
    name: 'Go',
    slug: 'golang',
    description: 'An open-source programming language.',
    reference_url: 'https://go.dev',
    category_name: 'Languages & Tools'
  },
  {
    name: 'Rust',
    slug: 'rust',
    description: 'A language empowering everyone to build reliable and efficient software.',
    reference_url: 'https://www.rust-lang.org',
    category_name: 'Languages & Tools'
  },
  {
    name: 'Java',
    slug: 'java',
    description: 'A high-level, class-based, object-oriented programming language.',
    reference_url: 'https://www.java.com',
    category_name: 'Languages & Tools'
  },
  {
    name: 'C#',
    slug: 'csharp',
    description: 'Modern, object-oriented programming language.',
    reference_url: 'https://docs.microsoft.com/en-us/dotnet/csharp/',
    category_name: 'Languages & Tools'
  },
  {
    name: 'Node.js',
    slug: 'nodejs',
    description: 'JavaScript runtime built on Chrome V8 JavaScript engine.',
    reference_url: 'https://nodejs.org',
    category_name: 'Frameworks'
  },
  {
    name: 'Express.js',
    slug: 'expressjs',
    description: 'Fast, unopinionated, minimalist web framework for Node.js.',
    reference_url: 'https://expressjs.com',
    category_name: 'Frameworks'
  },
  {
    name: 'Django',
    slug: 'django',
    description: 'High-level Python web framework.',
    reference_url: 'https://www.djangoproject.com',
    category_name: 'Frameworks'
  },
  {
    name: 'FastAPI',
    slug: 'fastapi',
    description: 'Modern, fast web framework for building APIs with Python.',
    reference_url: 'https://fastapi.tiangolo.com',
    category_name: 'Frameworks'
  },
  {
    name: 'Spring Boot',
    slug: 'spring-boot',
    description: 'Java-based framework for building production-ready applications.',
    reference_url: 'https://spring.io/projects/spring-boot',
    category_name: 'Frameworks'
  },
  {
    name: 'NestJS',
    slug: 'nestjs',
    description: 'Progressive Node.js framework for building efficient server-side applications.',
    reference_url: 'https://nestjs.com',
    category_name: 'Frameworks'
  },
  {
    name: 'PostgreSQL',
    slug: 'postgresql',
    description: 'A powerful, open source object-relational database system.',
    reference_url: 'https://www.postgresql.org/',
    category_name: 'Languages & Tools'
  },
  {
    name: 'MongoDB',
    slug: 'mongodb',
    description: 'The most popular NoSQL database.',
    reference_url: 'https://www.mongodb.com',
    category_name: 'Languages & Tools'
  },
  {
    name: 'Redis',
    slug: 'redis',
    description: 'In-memory data structure store, used as database, cache, and message broker.',
    reference_url: 'https://redis.io',
    category_name: 'Languages & Tools'
  },
  {
    name: 'MySQL',
    slug: 'mysql',
    description: 'Open-source relational database management system.',
    reference_url: 'https://www.mysql.com',
    category_name: 'Languages & Tools'
  },
  {
    name: 'Elasticsearch',
    slug: 'elasticsearch',
    description: 'Distributed search and analytics engine.',
    reference_url: 'https://www.elastic.co',
    category_name: 'Languages & Tools'
  },
  {
    name: 'Docker',
    slug: 'docker',
    description: 'Accelerate how you build, share, and run applications.',
    reference_url: 'https://www.docker.com',
    category_name: 'Platforms'
  },
  {
    name: 'Kubernetes',
    slug: 'kubernetes',
    description: 'Production-Grade Container Orchestration.',
    reference_url: 'https://kubernetes.io',
    category_name: 'Platforms'
  },
  {
    name: 'Terraform',
    slug: 'terraform',
    description: 'Infrastructure as Code to provision and manage cloud resources.',
    reference_url: 'https://www.terraform.io',
    category_name: 'Platforms'
  },
  {
    name: 'GitHub Actions',
    slug: 'github-actions',
    description: 'Automate, customize, and execute software development workflows.',
    reference_url: 'https://github.com/features/actions',
    category_name: 'Platforms'
  },
  {
    name: 'Jenkins',
    slug: 'jenkins',
    description: 'Open source automation server.',
    reference_url: 'https://www.jenkins.io',
    category_name: 'Platforms'
  },
  {
    name: 'GitLab CI',
    slug: 'gitlab-ci',
    description: 'Continuous Integration and Deployment built into GitLab.',
    reference_url: 'https://docs.gitlab.com/ee/ci/',
    category_name: 'Platforms'
  },
  {
    name: 'Ansible',
    slug: 'ansible',
    description: 'Simple, agentless automation platform.',
    reference_url: 'https://www.ansible.com',
    category_name: 'Platforms'
  },
  {
    name: 'AWS',
    slug: 'aws',
    description: 'Amazon Web Services cloud platform.',
    reference_url: 'https://aws.amazon.com',
    category_name: 'Platforms'
  },
  {
    name: 'Azure',
    slug: 'azure',
    description: 'Microsoft cloud computing platform.',
    reference_url: 'https://azure.microsoft.com',
    category_name: 'Platforms'
  },
  {
    name: 'Google Cloud',
    slug: 'gcp',
    description: 'Google Cloud Platform services.',
    reference_url: 'https://cloud.google.com',
    category_name: 'Platforms'
  },
  {
    name: 'DigitalOcean',
    slug: 'digitalocean',
    description: 'Simple cloud computing platform.',
    reference_url: 'https://www.digitalocean.com',
    category_name: 'Platforms'
  },
  {
    name: 'Vercel',
    slug: 'vercel',
    description: 'Platform for frontend developers.',
    reference_url: 'https://vercel.com',
    category_name: 'Platforms'
  },
  {
    name: 'OWASP Top 10',
    slug: 'owasp',
    description: 'Web application security risks awareness.',
    reference_url: 'https://owasp.org/www-project-top-ten/',
    category_name: 'Patterns & Practices'
  },
  {
    name: 'JWT',
    slug: 'jwt',
    description: 'JSON Web Tokens for secure information transmission.',
    reference_url: 'https://jwt.io',
    category_name: 'Patterns & Practices'
  },
  {
    name: 'OAuth 2.0',
    slug: 'oauth',
    description: 'Industry-standard protocol for authorization.',
    reference_url: 'https://oauth.net/2/',
    category_name: 'Patterns & Practices'
  },
  {
    name: 'SSL/TLS',
    slug: 'ssl-tls',
    description: 'Cryptographic protocols for secure communication.',
    reference_url: 'https://www.ssl.com/faqs/faq-what-is-ssl/',
    category_name: 'Patterns & Practices'
  },
  {
    name: 'Penetration Testing',
    slug: 'pentest',
    description: 'Simulated cyber attacks to identify vulnerabilities.',
    reference_url: 'https://www.sans.org/security-resources/penetration-testing',
    category_name: 'Patterns & Practices'
  },
  {
    name: 'Security Auditing',
    slug: 'security-audit',
    description: 'Systematic evaluation of security measures.',
    reference_url: 'https://www.cisa.gov/cybersecurity',
    category_name: 'Patterns & Practices'
  },
  {
    name: 'Microservices',
    slug: 'microservices',
    description: 'Architectural style structuring application as collection of services.',
    reference_url: 'https://microservices.io',
    category_name: 'Patterns & Practices'
  },
  {
    name: 'REST API',
    slug: 'rest-api',
    description: 'RESTful API design and implementation.',
    reference_url: 'https://restfulapi.net',
    category_name: 'Patterns & Practices'
  },
  {
    name: 'GraphQL',
    slug: 'graphql',
    description: 'Query language for APIs.',
    reference_url: 'https://graphql.org',
    category_name: 'Patterns & Practices'
  },
  {
    name: 'Event-Driven Architecture',
    slug: 'event-driven',
    description: 'Software architecture pattern promoting production and detection of events.',
    reference_url: 'https://aws.amazon.com/event-driven-architecture/',
    category_name: 'Patterns & Practices'
  },
  {
    name: 'Domain-Driven Design',
    slug: 'ddd',
    description: 'Approach to software development for complex needs.',
    reference_url: 'https://martinfowler.com/bliki/DomainDrivenDesign.html',
    category_name: 'Patterns & Practices'
  },
  {
    name: 'SOLID Principles',
    slug: 'solid',
    description: 'Five design principles for object-oriented programming.',
    reference_url: 'https://en.wikipedia.org/wiki/SOLID',
    category_name: 'Patterns & Practices'
  },
  {
    name: 'Design Patterns',
    slug: 'design-patterns',
    description: 'Reusable solutions to common software design problems.',
    reference_url: 'https://refactoring.guru/design-patterns',
    category_name: 'Patterns & Practices'
  },
  {
    name: 'Jest',
    slug: 'jest',
    description: 'Delightful JavaScript Testing Framework.',
    reference_url: 'https://jestjs.io',
    category_name: 'Frameworks'
  },
  {
    name: 'Pytest',
    slug: 'pytest',
    description: 'Python testing framework.',
    reference_url: 'https://pytest.org',
    category_name: 'Frameworks'
  },
  {
    name: 'Cypress',
    slug: 'cypress',
    description: 'Fast, easy and reliable testing for modern web applications.',
    reference_url: 'https://www.cypress.io',
    category_name: 'Frameworks'
  },
  {
    name: 'Selenium',
    slug: 'selenium',
    description: 'Browser automation framework.',
    reference_url: 'https://www.selenium.dev',
    category_name: 'Frameworks'
  },
  {
    name: 'TDD',
    slug: 'tdd',
    description: 'Test-Driven Development methodology.',
    reference_url: 'https://martinfowler.com/bliki/TestDrivenDevelopment.html',
    category_name: 'Patterns & Practices'
  },
  {
    name: 'Prometheus',
    slug: 'prometheus',
    description: 'Open-source monitoring and alerting toolkit.',
    reference_url: 'https://prometheus.io',
    category_name: 'Platforms'
  },
  {
    name: 'Grafana',
    slug: 'grafana',
    description: 'Open source analytics and monitoring platform.',
    reference_url: 'https://grafana.com',
    category_name: 'Platforms'
  },
  {
    name: 'ELK Stack',
    slug: 'elk',
    description: 'Elasticsearch, Logstash, and Kibana for log management.',
    reference_url: 'https://www.elastic.co/elastic-stack',
    category_name: 'Platforms'
  },
  {
    name: 'Datadog',
    slug: 'datadog',
    description: 'Monitoring and analytics platform.',
    reference_url: 'https://www.datadoghq.com',
    category_name: 'Platforms'
  },
  {
    name: 'New Relic',
    slug: 'newrelic',
    description: 'Observability platform for monitoring applications.',
    reference_url: 'https://newrelic.com',
    category_name: 'Platforms'
  },
  {
    name: 'Affinity Designer',
    slug: 'affinity-designer',
    description: 'Professional graphic design software.',
    reference_url: 'https://affinity.serif.com/designer/',
    category_name: 'Languages & Tools'
  },
  {
    name: 'bash',
    slug: 'bash',
    description: 'Unix shell and command language.',
    reference_url: 'https://www.gnu.org/software/bash/',
    category_name: 'Languages & Tools'
  },
  {
    name: 'c++',
    slug: 'cpp',
    description: 'General-purpose programming language.',
    reference_url: 'https://isocpp.org/',
    category_name: 'Languages & Tools'
  },
  {
    name: 'go',
    slug: 'go',
    description: 'Open-source programming language by Google.',
    reference_url: 'https://go.dev/',
    category_name: 'Languages & Tools'
  },
  {
    name: 'Hugo',
    slug: 'hugo',
    description: 'Fast and modern static site generator.',
    reference_url: 'https://gohugo.io/',
    category_name: 'Languages & Tools'
  },
  {
    name: 'Jupyter',
    slug: 'jupyter',
    description: 'Open-source web application for interactive computing.',
    reference_url: 'https://jupyter.org/',
    category_name: 'Languages & Tools'
  },
  {
    name: 'Matlab',
    slug: 'matlab',
    description: 'Programming platform for numerical computing.',
    reference_url: 'https://www.mathworks.com/products/matlab.html',
    category_name: 'Languages & Tools'
  },
  {
    name: 'Node.JS',
    slug: 'nodejs-lang',
    description: 'JavaScript runtime built on Chrome V8 engine.',
    reference_url: 'https://nodejs.org/',
    category_name: 'Languages & Tools'
  },
  {
    name: 'OpenCV',
    slug: 'opencv',
    description: 'Open source computer vision and machine learning library.',
    reference_url: 'https://opencv.org/',
    category_name: 'Languages & Tools'
  },
  {
    name: 'PlantUML',
    slug: 'plantuml',
    description: 'Tool for creating UML diagrams from plain text.',
    reference_url: 'https://plantuml.com/',
    category_name: 'Languages & Tools'
  },
  {
    name: 'Sphinx',
    slug: 'sphinx',
    description: 'Documentation generation tool for Python.',
    reference_url: 'https://www.sphinx-doc.org/',
    category_name: 'Languages & Tools'
  },
  {
    name: 'VS Code',
    slug: 'vscode',
    description: 'Code editor by Microsoft.',
    reference_url: 'https://code.visualstudio.com/',
    category_name: 'Languages & Tools'
  },
  {
    name: 'Arduino',
    slug: 'arduino',
    description: 'Open-source electronics platform.',
    reference_url: 'https://www.arduino.cc/',
    category_name: 'Platforms'
  },
  {
    name: 'Azure Functions',
    slug: 'azure-functions',
    description: 'Serverless compute service by Microsoft.',
    reference_url: 'https://azure.microsoft.com/services/functions/',
    category_name: 'Platforms'
  },
  {
    name: 'Cloudfoundry',
    slug: 'cloudfoundry',
    description: 'Open-source cloud application platform.',
    reference_url: 'https://www.cloudfoundry.org/',
    category_name: 'Platforms'
  },
  {
    name: 'Ethereum',
    slug: 'ethereum',
    description: 'Decentralized blockchain platform.',
    reference_url: 'https://ethereum.org/',
    category_name: 'Platforms'
  },
  {
    name: 'GitHub',
    slug: 'github',
    description: 'Development platform for hosting and reviewing code.',
    reference_url: 'https://github.com/',
    category_name: 'Platforms'
  },
  {
    name: 'Google Firebase',
    slug: 'firebase',
    description: 'App development platform by Google.',
    reference_url: 'https://firebase.google.com/',
    category_name: 'Platforms'
  },
  {
    name: 'ROS',
    slug: 'ros',
    description: 'Robot Operating System framework.',
    reference_url: 'https://www.ros.org/',
    category_name: 'Frameworks'
  },
  {
    name: 'CI/CD',
    slug: 'cicd',
    description: 'Continuous Integration and Continuous Deployment practices.',
    reference_url: 'https://www.redhat.com/en/topics/devops/what-is-ci-cd',
    category_name: 'Patterns & Practices'
  },
  {
    name: 'Data Analytics',
    slug: 'data-analytics',
    description: 'Process of examining data to draw conclusions.',
    reference_url: 'https://www.tableau.com/learn/articles/data-analytics',
    category_name: 'Patterns & Practices'
  },
  {
    name: 'Deep Learning',
    slug: 'deep-learning',
    description: 'Subset of machine learning using neural networks.',
    reference_url: 'https://www.deeplearning.ai/',
    category_name: 'Patterns & Practices'
  },
  {
    name: 'DevOps',
    slug: 'devops',
    description: 'Practices combining software development and IT operations.',
    reference_url: 'https://aws.amazon.com/devops/what-is-devops/',
    category_name: 'Patterns & Practices'
  },
  {
    name: 'Docs as Code',
    slug: 'docs-as-code',
    description: 'Treating documentation with the same tools as code.',
    reference_url: 'https://www.writethedocs.org/guide/docs-as-code/',
    category_name: 'Patterns & Practices'
  },
  {
    name: 'Infrastructure as Code',
    slug: 'iac',
    description: 'Managing infrastructure through code instead of manual processes.',
    reference_url: 'https://www.redhat.com/en/topics/automation/what-is-infrastructure-as-code-iac',
    category_name: 'Patterns & Practices'
  },
  {
    name: 'Software Architecture',
    slug: 'software-architecture',
    description: 'High-level structure of software systems.',
    reference_url: 'https://martinfowler.com/architecture/',
    category_name: 'Patterns & Practices'
  },
  {
    name: 'Static Site Generators',
    slug: 'static-site-generators',
    description: 'Tools for generating static HTML websites.',
    reference_url: 'https://jamstack.org/generators/',
    category_name: 'Patterns & Practices'
  },
  {
    name: 'Web Design',
    slug: 'web-design',
    description: 'Planning and creating websites with focus on aesthetics and usability.',
    reference_url: 'https://www.interaction-design.org/literature/topics/web-design',
    category_name: 'Patterns & Practices'
  },
] as const


export const SKILLS: Readonly<Skill[]> = SKILLS_CONFIG.map((skill, index) => ({
  ...skill,
  id: 's' + (index + 1),
}))

export const CURRENT_USER_ID = 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
