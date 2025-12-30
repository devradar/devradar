import type { Skill, ActivityType } from '@/types'

export const SKILLS_CONFIG: Readonly<Skill[]> = [
  // Frameworks - Frontend
  {
    id: 's1',
    category_id: 'c1',
    name: 'React',
    slug: 'react',
    description: 'A JavaScript library for building user interfaces.',
    reference_url: 'https://react.dev',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Frameworks'
  },
  {
    id: 's2',
    category_id: 'c1',
    name: 'Vue',
    slug: 'vue',
    description: 'The Progressive JavaScript Framework.',
    reference_url: 'https://vuejs.org',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Frameworks'
  },
  {
    id: 's3',
    category_id: 'c1',
    name: 'Angular',
    slug: 'angular',
    description: 'Platform for building mobile and desktop web applications.',
    reference_url: 'https://angular.io',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Frameworks'
  },
  {
    id: 's4',
    category_id: 'c1',
    name: 'Svelte',
    slug: 'svelte',
    description: 'Cybernetically enhanced web apps.',
    reference_url: 'https://svelte.dev',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Frameworks'
  },
  {
    id: 's5',
    category_id: 'c1',
    name: 'Next.js',
    slug: 'nextjs',
    description: 'The React Framework for Production.',
    reference_url: 'https://nextjs.org',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Frameworks'
  },
  // Languages & Tools - Programming Languages
  {
    id: 's10',
    category_id: 'c3',
    name: 'TypeScript',
    slug: 'typescript',
    description: 'JavaScript with syntax for types.',
    reference_url: 'https://www.typescriptlang.org',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Languages & Tools'
  },
  {
    id: 's11',
    category_id: 'c3',
    name: 'JavaScript',
    slug: 'javascript',
    description: 'The programming language of the Web.',
    reference_url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Languages & Tools'
  },
  {
    id: 's12',
    category_id: 'c3',
    name: 'Python',
    slug: 'python',
    description: 'A programming language that lets you work quickly.',
    reference_url: 'https://www.python.org',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Languages & Tools'
  },
  {
    id: 's13',
    category_id: 'c3',
    name: 'Go',
    slug: 'golang',
    description: 'An open-source programming language.',
    reference_url: 'https://go.dev',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Languages & Tools'
  },
  {
    id: 's14',
    category_id: 'c3',
    name: 'Rust',
    slug: 'rust',
    description: 'A language empowering everyone to build reliable and efficient software.',
    reference_url: 'https://www.rust-lang.org',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Languages & Tools'
  },
  {
    id: 's15',
    category_id: 'c3',
    name: 'Java',
    slug: 'java',
    description: 'A high-level, class-based, object-oriented programming language.',
    reference_url: 'https://www.java.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Languages & Tools'
  },
  {
    id: 's16',
    category_id: 'c3',
    name: 'C#',
    slug: 'csharp',
    description: 'Modern, object-oriented programming language.',
    reference_url: 'https://docs.microsoft.com/en-us/dotnet/csharp/',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Languages & Tools'
  },
  // Frameworks - Backend
  {
    id: 's20',
    category_id: 'c1',
    name: 'Node.js',
    slug: 'nodejs',
    description: 'JavaScript runtime built on Chrome V8 JavaScript engine.',
    reference_url: 'https://nodejs.org',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Frameworks'
  },
  {
    id: 's21',
    category_id: 'c1',
    name: 'Express.js',
    slug: 'expressjs',
    description: 'Fast, unopinionated, minimalist web framework for Node.js.',
    reference_url: 'https://expressjs.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Frameworks'
  },
  {
    id: 's22',
    category_id: 'c1',
    name: 'Django',
    slug: 'django',
    description: 'High-level Python web framework.',
    reference_url: 'https://www.djangoproject.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Frameworks'
  },
  {
    id: 's23',
    category_id: 'c1',
    name: 'FastAPI',
    slug: 'fastapi',
    description: 'Modern, fast web framework for building APIs with Python.',
    reference_url: 'https://fastapi.tiangolo.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Frameworks'
  },
  {
    id: 's24',
    category_id: 'c1',
    name: 'Spring Boot',
    slug: 'spring-boot',
    description: 'Java-based framework for building production-ready applications.',
    reference_url: 'https://spring.io/projects/spring-boot',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Frameworks'
  },
  {
    id: 's25',
    category_id: 'c1',
    name: 'NestJS',
    slug: 'nestjs',
    description: 'Progressive Node.js framework for building efficient server-side applications.',
    reference_url: 'https://nestjs.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Frameworks'
  },
  // Languages & Tools - Databases
  {
    id: 's30',
    category_id: 'c3',
    name: 'PostgreSQL',
    slug: 'postgresql',
    description: 'A powerful, open source object-relational database system.',
    reference_url: 'https://www.postgresql.org/',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Languages & Tools'
  },
  {
    id: 's31',
    category_id: 'c3',
    name: 'MongoDB',
    slug: 'mongodb',
    description: 'The most popular NoSQL database.',
    reference_url: 'https://www.mongodb.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Languages & Tools'
  },
  {
    id: 's32',
    category_id: 'c3',
    name: 'Redis',
    slug: 'redis',
    description: 'In-memory data structure store, used as database, cache, and message broker.',
    reference_url: 'https://redis.io',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Languages & Tools'
  },
  {
    id: 's33',
    category_id: 'c3',
    name: 'MySQL',
    slug: 'mysql',
    description: 'Open-source relational database management system.',
    reference_url: 'https://www.mysql.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Languages & Tools'
  },
  {
    id: 's34',
    category_id: 'c3',
    name: 'Elasticsearch',
    slug: 'elasticsearch',
    description: 'Distributed search and analytics engine.',
    reference_url: 'https://www.elastic.co',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Languages & Tools'
  },
  // Platforms - DevOps & Infrastructure
  {
    id: 's40',
    category_id: 'c2',
    name: 'Docker',
    slug: 'docker',
    description: 'Accelerate how you build, share, and run applications.',
    reference_url: 'https://www.docker.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Platforms'
  },
  {
    id: 's41',
    category_id: 'c2',
    name: 'Kubernetes',
    slug: 'kubernetes',
    description: 'Production-Grade Container Orchestration.',
    reference_url: 'https://kubernetes.io',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Platforms'
  },
  {
    id: 's42',
    category_id: 'c2',
    name: 'Terraform',
    slug: 'terraform',
    description: 'Infrastructure as Code to provision and manage cloud resources.',
    reference_url: 'https://www.terraform.io',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Platforms'
  },
  {
    id: 's43',
    category_id: 'c2',
    name: 'GitHub Actions',
    slug: 'github-actions',
    description: 'Automate, customize, and execute software development workflows.',
    reference_url: 'https://github.com/features/actions',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Platforms'
  },
  {
    id: 's44',
    category_id: 'c2',
    name: 'Jenkins',
    slug: 'jenkins',
    description: 'Open source automation server.',
    reference_url: 'https://www.jenkins.io',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Platforms'
  },
  {
    id: 's45',
    category_id: 'c2',
    name: 'GitLab CI',
    slug: 'gitlab-ci',
    description: 'Continuous Integration and Deployment built into GitLab.',
    reference_url: 'https://docs.gitlab.com/ee/ci/',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Platforms'
  },
  {
    id: 's46',
    category_id: 'c2',
    name: 'Ansible',
    slug: 'ansible',
    description: 'Simple, agentless automation platform.',
    reference_url: 'https://www.ansible.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Platforms'
  },
  // Platforms - Cloud
  {
    id: 's50',
    category_id: 'c2',
    name: 'AWS',
    slug: 'aws',
    description: 'Amazon Web Services cloud platform.',
    reference_url: 'https://aws.amazon.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Platforms'
  },
  {
    id: 's51',
    category_id: 'c2',
    name: 'Azure',
    slug: 'azure',
    description: 'Microsoft cloud computing platform.',
    reference_url: 'https://azure.microsoft.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Platforms'
  },
  {
    id: 's52',
    category_id: 'c2',
    name: 'Google Cloud',
    slug: 'gcp',
    description: 'Google Cloud Platform services.',
    reference_url: 'https://cloud.google.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Platforms'
  },
  {
    id: 's53',
    category_id: 'c2',
    name: 'DigitalOcean',
    slug: 'digitalocean',
    description: 'Simple cloud computing platform.',
    reference_url: 'https://www.digitalocean.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Platforms'
  },
  {
    id: 's54',
    category_id: 'c2',
    name: 'Vercel',
    slug: 'vercel',
    description: 'Platform for frontend developers.',
    reference_url: 'https://vercel.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Platforms'
  },
  // Patterns & Practices - Security
  {
    id: 's60',
    category_id: 'c4',
    name: 'OWASP Top 10',
    slug: 'owasp',
    description: 'Web application security risks awareness.',
    reference_url: 'https://owasp.org/www-project-top-ten/',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Patterns & Practices'
  },
  {
    id: 's61',
    category_id: 'c4',
    name: 'JWT',
    slug: 'jwt',
    description: 'JSON Web Tokens for secure information transmission.',
    reference_url: 'https://jwt.io',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Patterns & Practices'
  },
  {
    id: 's62',
    category_id: 'c4',
    name: 'OAuth 2.0',
    slug: 'oauth',
    description: 'Industry-standard protocol for authorization.',
    reference_url: 'https://oauth.net/2/',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Patterns & Practices'
  },
  {
    id: 's63',
    category_id: 'c4',
    name: 'SSL/TLS',
    slug: 'ssl-tls',
    description: 'Cryptographic protocols for secure communication.',
    reference_url: 'https://www.ssl.com/faqs/faq-what-is-ssl/',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Patterns & Practices'
  },
  {
    id: 's64',
    category_id: 'c4',
    name: 'Penetration Testing',
    slug: 'pentest',
    description: 'Simulated cyber attacks to identify vulnerabilities.',
    reference_url: 'https://www.sans.org/security-resources/penetration-testing',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Patterns & Practices'
  },
  {
    id: 's65',
    category_id: 'c4',
    name: 'Security Auditing',
    slug: 'security-audit',
    description: 'Systematic evaluation of security measures.',
    reference_url: 'https://www.cisa.gov/cybersecurity',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Patterns & Practices'
  },
  // Patterns & Practices - Architecture & Design
  {
    id: 's70',
    category_id: 'c4',
    name: 'Microservices',
    slug: 'microservices',
    description: 'Architectural style structuring application as collection of services.',
    reference_url: 'https://microservices.io',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Patterns & Practices'
  },
  {
    id: 's71',
    category_id: 'c4',
    name: 'REST API',
    slug: 'rest-api',
    description: 'RESTful API design and implementation.',
    reference_url: 'https://restfulapi.net',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Patterns & Practices'
  },
  {
    id: 's72',
    category_id: 'c4',
    name: 'GraphQL',
    slug: 'graphql',
    description: 'Query language for APIs.',
    reference_url: 'https://graphql.org',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Patterns & Practices'
  },
  {
    id: 's73',
    category_id: 'c4',
    name: 'Event-Driven Architecture',
    slug: 'event-driven',
    description: 'Software architecture pattern promoting production and detection of events.',
    reference_url: 'https://aws.amazon.com/event-driven-architecture/',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Patterns & Practices'
  },
  {
    id: 's74',
    category_id: 'c4',
    name: 'Domain-Driven Design',
    slug: 'ddd',
    description: 'Approach to software development for complex needs.',
    reference_url: 'https://martinfowler.com/bliki/DomainDrivenDesign.html',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Patterns & Practices'
  },
  {
    id: 's75',
    category_id: 'c4',
    name: 'SOLID Principles',
    slug: 'solid',
    description: 'Five design principles for object-oriented programming.',
    reference_url: 'https://en.wikipedia.org/wiki/SOLID',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Patterns & Practices'
  },
  {
    id: 's76',
    category_id: 'c4',
    name: 'Design Patterns',
    slug: 'design-patterns',
    description: 'Reusable solutions to common software design problems.',
    reference_url: 'https://refactoring.guru/design-patterns',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Patterns & Practices'
  },
  // Frameworks - Testing
  {
    id: 's80',
    category_id: 'c1',
    name: 'Jest',
    slug: 'jest',
    description: 'Delightful JavaScript Testing Framework.',
    reference_url: 'https://jestjs.io',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Frameworks'
  },
  {
    id: 's81',
    category_id: 'c1',
    name: 'Pytest',
    slug: 'pytest',
    description: 'Python testing framework.',
    reference_url: 'https://pytest.org',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Frameworks'
  },
  {
    id: 's82',
    category_id: 'c1',
    name: 'Cypress',
    slug: 'cypress',
    description: 'Fast, easy and reliable testing for modern web applications.',
    reference_url: 'https://www.cypress.io',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Frameworks'
  },
  {
    id: 's83',
    category_id: 'c1',
    name: 'Selenium',
    slug: 'selenium',
    description: 'Browser automation framework.',
    reference_url: 'https://www.selenium.dev',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Frameworks'
  },
  {
    id: 's84',
    category_id: 'c4',
    name: 'TDD',
    slug: 'tdd',
    description: 'Test-Driven Development methodology.',
    reference_url: 'https://martinfowler.com/bliki/TestDrivenDevelopment.html',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Patterns & Practices'
  },
  // Platforms - Monitoring & Observability
  {
    id: 's90',
    category_id: 'c2',
    name: 'Prometheus',
    slug: 'prometheus',
    description: 'Open-source monitoring and alerting toolkit.',
    reference_url: 'https://prometheus.io',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Platforms'
  },
  {
    id: 's91',
    category_id: 'c2',
    name: 'Grafana',
    slug: 'grafana',
    description: 'Open source analytics and monitoring platform.',
    reference_url: 'https://grafana.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Platforms'
  },
  {
    id: 's92',
    category_id: 'c2',
    name: 'ELK Stack',
    slug: 'elk',
    description: 'Elasticsearch, Logstash, and Kibana for log management.',
    reference_url: 'https://www.elastic.co/elastic-stack',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Platforms'
  },
  {
    id: 's93',
    category_id: 'c2',
    name: 'Datadog',
    slug: 'datadog',
    description: 'Monitoring and analytics platform.',
    reference_url: 'https://www.datadoghq.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Platforms'
  },
  {
    id: 's94',
    category_id: 'c2',
    name: 'New Relic',
    slug: 'newrelic',
    description: 'Observability platform for monitoring applications.',
    reference_url: 'https://newrelic.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Platforms'
  }
] as const

export const ACTIVITY_TYPES_CONFIG: Readonly<ActivityType[]> = [
  {
    slug: 'project-work',
    name: 'Project Work',
    weight_multiplier: 1.5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    slug: 'code-review',
    name: 'Code Review',
    weight_multiplier: 1.2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    slug: 'mentoring',
    name: 'Mentoring',
    weight_multiplier: 1.8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    slug: 'self-study',
    name: 'Self Study',
    weight_multiplier: 0.8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    slug: 'training',
    name: 'Professional Training',
    weight_multiplier: 1.0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
] as const

export const CURRENT_USER_ID = 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
