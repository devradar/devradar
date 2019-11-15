export default {
  rick: {
    meta: {
      title: 'Sanchez Skills',
      categories: [ 'Tools', 'Techniques', 'Platforms', 'Frameworks' ],
      levels: [ 'Novice', 'Intermediate', 'Advanced', 'Veteran' ],
      isPublic: true,
      owner: 'rickUser'
    },
    blips: [
      {
        category: 0,
        level: 0,
        link: 'https://devradar.io/stuff',
        title: 'stuff',
        changes: [
          {
            date: '2018-04',
            newLevel: 0,
            text: 'stuff is super important'
          }
        ]
      },
      {
        category: 1,
        link: 'https://devradar.io/help',
        title: 'help',
        changes: [
          {
            date: '2018-04',
            newLevel: 2,
            text: 'I help a lot'
          }
        ]
      },
      {
        category: 2,
        link: 'https://devradar.io/flurps',
        title: 'flurps',
        changes: [
          {
            date: '2018-09',
            newLevel: 3,
            text: 'flurps are strange'
          }
        ]
      },
      {
        category: 3,
        link: 'https://devradar.io/things',
        title: 'things',
        changes: [
          {
            date: '2019-04',
            newLevel: 1,
            text: 'things are great'
          }
        ]
      }
    ]

  }
}
