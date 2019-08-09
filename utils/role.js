const Role = {
  Leader:[
    { id: 2, name: "领队" },
    { id: 1, name: "总领队" },
    { id: 3, name: "副领队" },
  ],
  Coach:[
    { id: 1, name: "主教练" },
    { id: 2, name: "助理教练" },
    { id: 3, name: "教练员" },
  ],
  Player:[
    { id: 2, name:"队长" },
    { id: 1, name: "队员"},
  ],
  Office:[
    { id: 1, name: "翻译"},
    { id: 2, name: "队医"},
  ],
  Other:[
    { id: 99, name: "其他"},
  ],
  Position:[
    { id: 1, name: "前锋" },
    { id: 2, name: "中场" },
    { id: 3, name: "后卫" },
    { id: 4, name: "门将" },
    { id: 5, name: "待定" },
  ]
}
module.exports= Role;