
function getTypes() {
  let types = [
    { id: 1, name: '业余' },
    { id: 2, name: '校园' },
    { id: 3, name: '职业' },
    { id: 4, name: '半职业' }
  ];

  return types;
}

function getDegrees() {
  const degrees = [
    { id: 1, name: '小学' },
    { id: 2, name: '初中' },
    { id: 3, name: '高中' },
    { id: 4, name: '大专' },
    { id: 5, name: '本科' },
    { id: 6, name: '硕士' },
    { id: 7, name: '博士' }
  ];

  return degrees;
}
function getDegree(id) {
  let degrees = getDegrees();
  const degree = degrees.find(item => item.id == id);
  return degree;
}
function getDegreeByName(name) {
  let degrees = getDegrees();
  const degree = degrees.find(item => item.name == name);
  return degree;
}

function getJobs() {
  let jobs = [
    { "id": 1, "name": "领队" },
    { "id": 2, "name": "教练" },
    { "id": 3, "name": "队员" },
    { "id": 4, "name": "官员或工作人员" },
  ]

  return jobs;
}
function getJob(id) {
  let jobs = getJobs();
  const job = jobs.find(item => item.id == id);
  return job;
}

function getSubJobs(job) {
  let sub_jobs = [];
  if (job == 1) {
    sub_jobs = [
      { "id": 2, "name": "领队" },
      { "id": 1, "name": "总领队" },
      { "id": 99, "name": "其他" },
    ]
  } else if (job == 2) {
    sub_jobs = [
      { "id": 1, "name": "主教练" },
      { "id": 2, "name": "助理教练" },
      { "id": 3, "name": "其他教练" },
      { "id": 99, "name": "其他" },
    ]
  } else if (job == 3) {
    sub_jobs = [
      { "id": 1, "name": "队员" },
      { "id": 2, "name": "队长" },
    ]
  } else if (job == 4) {
    sub_jobs = [
      { "id": 1, "name": "翻译" },
      { "id": 2, "name": "队医" },
      { "id": 99, "name": "其他" },
    ]
  }

  return sub_jobs;
}
function getSubJob(jobId, subJobId) {
  const subjobs = getSubJobs(jobId);
  const subjob = subjobs.find(item=>item.id==subJobId);
  return subjob;
}
function getSubJobByName(jobId, subJobName) {
  const subjobs = getSubJobs(jobId);
  const subjob = subjobs.find(item=>item.name==subJobName);
  return subjob;
}

function getPositions() {
  let positions = [
    { "id": '', "name": "-" },
    { "id": 10, "name": "前锋" },
    { "id": 20, "name": "中场" },
    { "id": 30, "name": "后卫" },
    { "id": 40, "name": "门将" },
  ]

  return positions;
}
function getPosition(id) {
  let positions = getPositions();
  const position = positions.find(item => item.id == id);
  return position;
}
function getPositionByName(name) {
  let positions = getPositions();
  const position = positions.find(item => item.name == name);
  return position;
}

function getRightsList() {
  let rightsList = [
    { "id": 0, "name": "普通队员" },
    { "id": 1, "name": "管理员" },
    { "id": 2, "name": "超级管理员" }
  ]
  return rightsList;
}
function getRights(id) {
  let rightsList = getRightsList();
  const rights = rightsList.find(item => item.id == id);
  return rights;
}

function getNationality(){
  let nationality = [
    { "text": "安道尔", "value": "AND", "first": "A", "id":0 },
    { "text": "阿联酋", "value": "ARE", "first": "A", "id":1 },
    { "text": "阿富汗", "value": "AFG", "first": "A", "id":2 },
    { "text": "安提瓜和巴布达", "value": "ATG", "first": "A", "id":3 },
    { "text": "安圭拉", "value": "AIA", "first": "A", "id":4 },
    { "text": "阿尔巴尼亚", "value": "ALB", "first": "A", "id":5 },
    { "text": "亚美尼亚", "value": "ARM", "first": "Y", "id":6 },
    { "text": "安哥拉", "value": "AGO", "first": "A", "id":7 },
    { "text": "南极洲", "value": "ATA", "first": "N", "id":8 },
    { "text": "阿根廷", "value": "ARG", "first": "A", "id":9 },
    { "text": "美属萨摩亚", "value": "ASM", "first": "M", "id":10, },
    { "text": "奥地利", "value": "AUT", "first": "A", "id":11, },
    { "text": "澳大利亚", "value": "AUS", "first": "A", "id":12, },
    { "text": "阿鲁巴", "value": "ABW", "first": "A", "id":13, },
    { "text": "奥兰群岛", "value": "ALA", "first": "A", "id":14, },
    { "text": "阿塞拜疆", "value": "AZE", "first": "A", "id":15, },
    { "text": "波黑", "value": "BIH", "first": "B", "id":16, },
    { "text": "巴巴多斯", "value": "BRB", "first": "B", "id":17, },
    { "text": "孟加拉", "value": "BGD", "first": "M", "id":18, },
    { "text": "比利时", "value": "BEL", "first": "B", "id":19, },
    { "text": "布基纳法索", "value": "BFA", "first": "B", "id":20, },
    { "text": "保加利亚", "value": "BGR", "first": "B", "id":21, },
    { "text": "巴林", "value": "BHR", "first": "B", "id":22, },
    { "text": "布隆迪", "value": "BDI", "first": "B", "id":23 },
    { "text": "贝宁", "value": "BEN", "first": "B", "id":24 },
    { "text": "圣巴泰勒米岛", "value": "BLM", "first": "S", "id":25 },
    { "text": "百慕大", "value": "BMU", "first": "B", "id":26 },
    { "text": "文莱", "value": "BRN", "first": "W", "id":27 },
    { "text": "玻利维亚", "value": "BOL", "first": "B", "id":28 },
    { "text": "荷兰加勒比区", "value": "BES", "first": "H", "id":29 },
    { "text": "巴西", "value": "BRA", "first": "B", "id":30 },
    { "text": "巴哈马", "value": "BHS", "first": "B", "id":31 },
    { "text": "不丹", "value": "BTN", "first": "B", "id":32 },
    { "text": "布韦岛", "value": "BVT", "first": "B", "id":33 },
    { "text": "博茨瓦纳", "value": "BWA", "first": "B", "id":34 },
    { "text": "白俄罗斯", "value": "BLR", "first": "B", "id":35 },
    { "text": "伯利兹", "value": "BLZ", "first": "B", "id":36 },
    { "text": "加拿大", "value": "CAN", "first": "J", "id":37 },
    { "text": "科科斯群岛", "value": "CCK", "first": "K", "id":38 },
    { "text": "中非", "value": "CAF", "first": "Z", "id":39 },
    { "text": "瑞士", "value": "CHE", "first": "R", "id":40 },
    { "text": "智利", "value": "CHL", "first": "Z", "id":41 },
    { "text": "喀麦隆", "value": "CMR", "first": "K", "id":42 },
    { "text": "哥伦比亚", "value": "COL", "first": "G", "id":43 },
    { "text": "哥斯达黎加", "value": "CRI", "first": "G", "id":44 },
    { "text": "古巴", "value": "CUB", "first": "G", "id":45 },
    { "text": "佛得角", "value": "CPV", "first": "F", "id":46 },
    { "text": "圣诞岛", "value": "CXR", "first": "S", "id":47 },
    { "text": "塞浦路斯", "value": "CYP", "first": "S", "id":48 },
    { "text": "捷克", "value": "CZE", "first": "J", "id":49 },
    { "text": "德国", "value": "DEU", "first": "D", "id":50 },
    { "text": "吉布提", "value": "DJI", "first": "J", "id":51 },
    { "text": "丹麦", "value": "DNK", "first": "D", "id":52 },
    { "text": "多米尼克", "value": "DMA", "first": "D", "id":53 },
    { "text": "多米尼加", "value": "DOM", "first": "D", "id":54 },
    { "text": "阿尔及利亚", "value": "DZA", "first": "A", "id":55 },
    { "text": "厄瓜多尔", "value": "ECU", "first": "E", "id":56 },
    { "text": "爱沙尼亚", "value": "EST", "first": "A", "id":57 },
    { "text": "埃及", "value": "EGY", "first": "A", "id":58 },
    { "text": "西撒哈拉", "value": "ESH", "first": "X", "id":59 },
    { "text": "厄立特里亚", "value": "ERI", "first": "E", "id":60 },
    { "text": "西班牙", "value": "ESP", "first": "X", "id":61 },
    { "text": "芬兰", "value": "FIN", "first": "F", "id":62 },
    { "text": "斐济群岛", "value": "FJI", "first": "F", "id":63 },
    { "text": "马尔维纳斯群岛（ 福克兰）", "value": "FLK", "first": "M", "id":64 },
    { "text": "密克罗尼西亚联邦", "value": "FSM", "first": "M", "id":65 },
    { "text": "法罗群岛", "value": "FRO", "first": "F", "id":66 },
    { "text": "法国", "value": "FRA", "first": "F", "id":67 },
    { "text": "加蓬", "value": "GAB", "first": "J", "id":68 },
    { "text": "格林纳达", "value": "GRD", "first": "G", "id":69 },
    { "text": "格鲁吉亚", "value": "GEO", "first": "G", "id":70 },
    { "text": "法属圭亚那", "value": "GUF", "first": "F", "id":71 },
    { "text": "加纳", "value": "GHA", "first": "J", "id":72 },
    { "text": "直布罗陀", "value": "GIB", "first": "Z", "id":73 },
    { "text": "格陵兰", "value": "GRL", "first": "G", "id":74 },
    { "text": "几内亚", "value": "GIN", "first": "J", "id":75 },
    { "text": "瓜德罗普", "value": "GLP", "first": "G", "id":76 },
    { "text": "赤道几内亚", "value": "GNQ", "first": "C", "id":77 },
    { "text": "希腊", "value": "GRC", "first": "X", "id":78 },
    { "text": "南乔治亚岛和南桑威奇群岛", "value": "SGS", "first": "N", "id":79 },
    { "text": "危地马拉", "value": "GTM", "first": "W", "id":80 },
    { "text": "关岛", "value": "GUM", "first": "G", "id":81 },
    { "text": "几内亚比绍", "value": "GNB", "first": "J", "id":82 },
    { "text": "圭亚那", "value": "GUY", "first": "G", "id":83 },
    { "text": "赫德岛和麦克唐纳群岛", "value": "HMD", "first": "H", "id":84 },
    { "text": "洪都拉斯", "value": "HND", "first": "H", "id":85 },
    { "text": "克罗地亚", "value": "HRV", "first": "K", "id":86 },
    { "text": "海地", "value": "HTI", "first": "H", "id":87 },
    { "text": "匈牙利", "value": "HUN", "first": "X", "id":88 },
    { "text": "印尼", "value": "IDN", "first": "Y", "id":89 },
    { "text": "爱尔兰", "value": "IRL", "first": "A", "id":90 },
    { "text": "以色列", "value": "ISR", "first": "Y", "id":91 },
    { "text": "马恩岛", "value": "IMN", "first": "M", "id":92 },
    { "text": "印度", "value": "IND", "first": "Y", "id":93 },
    { "text": "英属印度洋领地", "value": "IOT", "first": "Y", "id":94 },
    { "text": "伊拉克", "value": "IRQ", "first": "Y", "id":95 },
    { "text": "伊朗", "value": "IRN", "first": "Y", "id":96 },
    { "text": "冰岛", "value": "ISL", "first": "B", "id":97 },
    { "text": "意大利", "value": "ITA", "first": "Y", "id":98 },
    { "text": "泽西岛", "value": "JEY", "first": "Z", "id":99 },
    { "text": "牙买加", "value": "JAM", "first": "Y", "id":100 },
    { "text": "约旦", "value": "JOR", "first": "Y", "id":101 },
    { "text": "日本", "value": "JPN", "first": "R", "id":102 },
    { "text": "柬埔寨", "value": "KHM", "first": "J", "id":103 },
    { "text": "基里巴斯", "value": "KIR", "first": "J", "id":104 },
    { "text": "科摩罗", "value": "COM", "first": "K", "id":105 },
    { "text": "科威特", "value": "KWT", "first": "K", "id":106 },
    { "text": "开曼群岛", "value": "CYM", "first": "K", "id":107 },
    { "text": "黎巴嫩", "value": "LBN", "first": "L", "id":108 },
    { "text": "列支敦士登", "value": "LIE", "first": "L", "id":109 },
    { "text": "斯里兰卡", "value": "LKA", "first": "S", "id":110 },
    { "text": "利比里亚", "value": "LBR", "first": "L", "id":111 },
    { "text": "莱索托", "value": "LSO", "first": "L", "id":112 },
    { "text": "立陶宛", "value": "LTU", "first": "L", "id":113 },
    { "text": "卢森堡", "value": "LUX", "first": "L", "id":114 },
    { "text": "拉脱维亚", "value": "LVA", "first": "L", "id":115 },
    { "text": "利比亚", "value": "LBY", "first": "L", "id":116 },
    { "text": "摩洛哥", "value": "MAR", "first": "M", "id":117 },
    { "text": "摩纳哥", "value": "MCO", "first": "M", "id":118 },
    { "text": "摩尔多瓦", "value": "MDA", "first": "M", "id":119 },
    { "text": "黑山", "value": "MNE", "first": "H", "id":120 },
    { "text": "法属圣马丁", "value": "MAF", "first": "F", "id":121 },
    { "text": "马达加斯加", "value": "MDG", "first": "M", "id":122 },
    { "text": "马绍尔群岛", "value": "MHL", "first": "M", "id":123 },
    { "text": "马其顿", "value": "MKD", "first": "M", "id":124 },
    { "text": "马里", "value": "MLI", "first": "M", "id":125 },
    { "text": "缅甸", "value": "MMR", "first": "M", "id":126 },
    { "text": "马提尼克", "value": "MTQ", "first": "M", "id":127 },
    { "text": "毛里塔尼亚", "value": "MRT", "first": "M", "id":128 },
    { "text": "蒙塞拉特岛", "value": "MSR", "first": "M", "id":129 },
    { "text": "马耳他", "value": "MLT", "first": "M", "id":130 },
    { "text": "马尔代夫", "value": "MDV", "first": "M", "id":131 },
    { "text": "马拉维", "value": "MWI", "first": "M", "id":132 },
    { "text": "墨西哥", "value": "MEX", "first": "M", "id":133 },
    { "text": "马来西亚", "value": "MYS", "first": "M", "id":134 },
    { "text": "纳米比亚", "value": "NAM", "first": "N", "id":135 },
    { "text": "尼日尔", "value": "NER", "first": "N", "id":136 },
    { "text": "诺福克岛", "value": "NFK", "first": "N", "id":136 },
    { "text": "尼日利亚", "value": "NGA", "first": "N", "id":137 },
    { "text": "尼加拉瓜", "value": "NIC", "first": "N", "id":138 },
    { "text": "荷兰", "value": "NLD", "first": "H", "id":139 },
    { "text": "挪威", "value": "NOR", "first": "N", "id":140 },
    { "text": "尼泊尔", "value": "NPL", "first": "N", "id":141 },
    { "text": "瑙鲁", "value": "NRU", "first": "N", "id":142 },
    { "text": "阿曼", "value": "OMN", "first": "A", "id":143 },
    { "text": "巴拿马", "value": "PAN", "first": "B", "id":144 },
    { "text": "秘鲁", "value": "PER", "first": "M", "id":145 },
    { "text": "法属波利尼西亚", "value": "PYF", "first": "F", "id":146 },
    { "text": "巴布亚新几内亚", "value": "PNG", "first": "B", "id":147 },
    { "text": "菲律宾", "value": "PHL", "first": "F", "id":148 },
    { "text": "巴基斯坦", "value": "PAK", "first": "B", "id":149 },
    { "text": "波兰", "value": "POL", "first": "B", "id":150 },
    { "text": "皮特凯恩群岛", "value": "PCN", "first": "P", "id":151 },
    { "text": "波多黎各", "value": "PRI", "first": "B", "id":152 },
    { "text": "巴勒斯坦", "value": "PSE", "first": "B", "id":153 },
    { "text": "帕劳", "value": "PLW", "first": "P", "id":154 },
    { "text": "巴拉圭", "value": "PRY", "first": "B", "id":155 },
    { "text": "卡塔尔", "value": "QAT", "first": "K", "id":156 },
    { "text": "留尼汪", "value": "REU", "first": "L", "id":157 },
    { "text": "罗马尼亚", "value": "ROU", "first": "L", "id":158 },
    { "text": "塞尔维亚", "value": "SRB", "first": "S", "id":159 },
    { "text": "俄罗斯", "value": "RUS", "first": "E", "id":160 },
    { "text": "卢旺达", "value": "RWA", "first": "L", "id":161 },
    { "text": "所罗门群岛", "value": "SLB", "first": "S", "id":162 },
    { "text": "塞舌尔", "value": "SYC", "first": "S", "id":163 },
    { "text": "苏丹", "value": "SDN", "first": "S", "id":164 },
    { "text": "瑞典", "value": "SWE", "first": "R", "id":165 },
    { "text": "新加坡", "value": "SGP", "first": "X", "id":166 },
    { "text": "斯洛文尼亚", "value": "SVN", "first": "S", "id":167 },
    { "text": "斯瓦尔巴群岛和 扬马延岛", "value": "SJM", "first": "S", "id":168 },
    { "text": "斯洛伐克", "value": "SVK", "first": "S", "id":169 },
    { "text": "塞拉利昂", "value": "SLE", "first": "S", "id":170 },
    { "text": "圣马力诺", "value": "SMR", "first": "S", "id":171 },
    { "text": "塞内加尔", "value": "SEN", "first": "S", "id":172 },
    { "text": "索马里", "value": "SOM", "first": "S", "id":173 },
    { "text": "苏里南", "value": "SUR", "first": "S", "id":174 },
    { "text": "南苏丹", "value": "SSD", "first": "N", "id":175 },
    { "text": "圣多美和普林西比", "value": "STP", "first": "S", "id":176 },
    { "text": "萨尔瓦多", "value": "SLV", "first": "S", "id":177 },
    { "text": "叙利亚", "value": "SYR", "first": "X", "id":178 },
    { "text": "斯威士兰", "value": "SWZ", "first": "S", "id":179 },
    { "text": "特克斯和凯科斯群岛", "value": "TCA", "first": "T", "id":180 },
    { "text": "乍得", "value": "TCD", "first": "Z", "id":181 },
    { "text": "多哥", "value": "TGO", "first": "D", "id":182 },
    { "text": "泰国", "value": "THA", "first": "T", "id":183 },
    { "text": "托克劳", "value": "TKL", "first": "T", "id":184 },
    { "text": "东帝汶", "value": "TLS", "first": "D", "id":185 },
    { "text": "突尼斯", "value": "TUN", "first": "T", "id":186 },
    { "text": "汤加", "value": "TON", "first": "T", "id":187 },
    { "text": "土耳其", "value": "TUR", "first": "T", "id":188 },
    { "text": "图瓦卢", "value": "TUV", "first": "T", "id":189 },
    { "text": "坦桑尼亚", "value": "TZA", "first": "T", "id":190 },
    { "text": "乌克兰", "value": "UKR", "first": "W", "id":191 },
    { "text": "乌干达", "value": "UGA", "first": "W", "id":192 },
    { "text": "美国", "value": "USA", "first": "M", "id":193 },
    { "text": "乌拉圭", "value": "URY", "first": "W", "id":194 },
    { "text": "梵蒂冈", "value": "VAT", "first": "F", "id":195 },
    { "text": "委内瑞拉", "value": "VEN", "first": "W", "id":196 },
    { "text": "英属维尔京群岛", "value": "VGB", "first": "Y", "id":197 },
    { "text": "美属维尔京群岛", "value": "VIR", "first": "M", "id":198 },
    { "text": "越南", "value": "VNM", "first": "Y", "id":199 },
    { "text": "瓦利斯和富图纳", "value": "WLF", "first": "W", "id":200 },
    { "text": "萨摩亚", "value": "WSM", "first": "S", "id":201 },
    { "text": "也门", "value": "YEM", "first": "Y", "id":202 },
    { "text": "马约特", "value": "MYT", "first": "M", "id":203 },
    { "text": "南非", "value": "ZAF", "first": "N", "id":204 },
    { "text": "赞比亚", "value": "ZMB", "first": "Z", "id":205 },
    { "text": "津巴布韦", "value": "ZWE", "first": "J", "id":206 },
    { "text": "刚果（布）", "value": "COG", "first": "G", "id":207 },
    { "text": "刚果（金）", "value": "COD", "first": "G", "id":208 },
    { "text": "莫桑比克", "value": "MOZ", "first": "M", "id":209 },
    { "text": "根西岛", "value": "GGY", "first": "G", "id":210 },
    { "text": "冈比亚", "value": "GMB", "first": "G", "id":211 },
    { "text": "北马里亚纳群岛", "value": "MNP", "first": "B", "id":212 },
    { "text": "埃塞俄比亚", "value": "ETH", "first": "A", "id":213 },
    { "text": "新喀里多尼亚", "value": "NCL", "first": "X", "id":214 },
    { "text": "瓦努阿图", "value": "VUT", "first": "W", "id":215 },
    { "text": "法属南部领地", "value": "ATF", "first": "F", "id":216 },
    { "text": "纽埃", "value": "NIU", "first": "N", "id":217 },
    { "text": "美国本土外小岛屿", "value": "UMI", "first": "M", "id":218 },
    { "text": "库克群岛", "value": "COK", "first": "K", "id":219 },
    { "text": "英国", "value": "GBR", "first": "Y", "id":220 },
    { "text": "特立尼达和多巴哥", "value": "TTO", "first": "T", "id":221 },
    { "text": "圣文森特和格林纳丁斯", "value": "VCT", "first": "S", "id":222 },
    { "text": "新西兰", "value": "NZL", "first": "X", "id":223 },
    { "text": "沙特阿拉伯", "value": "SAU", "first": "S", "id":224 },
    { "text": "老挝", "value": "LAO", "first": "L", "id":225 },
    { "text": "朝鲜 北朝鲜", "value": "PRK", "first": "C", "id":226 },
    { "text": "韩国 南朝鲜", "value": "KOR", "first": "H", "id":227 },
    { "text": "葡萄牙", "value": "PRT", "first": "P", "id":228 },
    { "text": "吉尔吉斯斯坦", "value": "KGZ", "first": "J", "id":229 },
    { "text": "哈萨克斯坦", "value": "KAZ", "first": "H", "id":230 },
    { "text": "塔吉克斯坦", "value": "TJK", "first": "T", "id":231 },
    { "text": "土库曼斯坦", "value": "TKM", "first": "T", "id":232 },
    { "text": "乌兹别克斯坦", "value": "UZB", "first": "W", "id":233 },
    { "text": "圣基茨和尼维斯", "value": "KNA", "first": "S", "id":234 },
    { "text": "圣皮埃尔和密克隆", "value": "SPM", "first": "S", "id":235 },
    { "text": "圣赫勒拿", "value": "SHN", "first": "S", "id":236 },
    { "text": "圣卢西亚", "value": "LCA", "first": "S", "id":237 },
    { "text": "毛里求斯", "value": "MUS", "first": "M", "id":238 },
    { "text": "科特迪瓦", "value": "CIV", "first": "K", "id":239 },
    { "text": "肯尼亚", "value": "KEN", "first": "K", "id":240 },
    { "text": "蒙古国 蒙古", "value": "MNG", "first": "M", "id":241 },
    { "text": "中国", "value": "ZGZ", "first": "Z", "id":242 }
  ];
  return nationality
}

function getNationalities() {
    let nationalities = [
        { id: 1 , name: "汉族" },
        { id: 2 , name: "蒙古族" },
        { id: 3 , name: "回族" },
        { id: 4 , name: "藏族" },
        { id: 5 , name: "维吾尔族" },
        { id: 6 , name: "苗族" },
        { id: 7 , name: "彝族" },
        { id: 8 , name: "壮族" },
        { id: 9 , name: "布依族" },
        { id: 10, name: "朝鲜族" },
        { id: 11, name: "满族" },
        { id: 12, name: "侗族" },
        { id: 13, name: "瑶族" },
        { id: 14, name: "白族" },
        { id: 15, name: "土家族" },
        { id: 16, name: "哈尼族" },
        { id: 17, name: "哈萨克族" },
        { id: 18, name: "傣族" },
        { id: 19, name: "黎族" },
        { id: 20, name: "傈僳族" },
        { id: 21, name: "佤族" },
        { id: 22, name: "畲族" },
        { id: 23, name: "高山族" },
        { id: 24, name: "拉祜族" },
        { id: 25, name: "水族" },
        { id: 26, name: "东乡族" },
        { id: 27, name: "纳西族" },
        { id: 28, name: "景颇族" },
        { id: 29, name: "柯尔克孜族" },
        { id: 30, name: "土族" },
        { id: 31, name: "达斡尔族" },
        { id: 32, name: "仫佬族" },
        { id: 33, name: "羌族" },
        { id: 34, name: "布朗族" },
        { id: 35, name: "撒拉族" },
        { id: 36, name: "毛难族" },
        { id: 37, name: "仡佬族" },
        { id: 38, name: "锡伯族" },
        { id: 39, name: "阿昌族" },
        { id: 40, name: "普米族" },
        { id: 41, name: "塔吉克族" },
        { id: 42, name: "怒族" },
        { id: 43, name: "乌孜别克族" },
        { id: 44, name: "俄罗斯族" },
        { id: 45, name: "鄂温克族" },
        { id: 46, name: "崩龙族" },
        { id: 47, name: "保安族" },
        { id: 48, name: "裕固族" },
        { id: 49, name: "京族" },
        { id: 50, name: "塔塔尔族" },
        { id: 51, name: "独龙族" },
        { id: 52, name: "鄂伦春族" },
        { id: 53, name: "赫哲族" },
        { id: 54, name: "门巴族" },
        { id: 55, name: "珞巴族" },
        { id: 56, name: "基诺族" },
        { id: 57, name: "其他" }
    ];
    return nationalities;
  }


module.exports = {
  getTypes,
  getDegrees,
  getDegree,
  getDegreeByName,
  getJobs,
  getJob,
  getSubJobs,
  getSubJob,
  getSubJobByName,
  getPositions,
  getPosition,
  getPositionByName,
  getRightsList,
  getRights,
  getNationality,
  getNationalities
}
