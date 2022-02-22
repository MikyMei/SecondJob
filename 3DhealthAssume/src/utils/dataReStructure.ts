/**

 * @author MikyMei

 * @date 2022-01-10 13:51

 */

import moment from "moment";
import Icon, {HomeOutlined} from '@ant-design/icons';

/**
 * 传入接口请求来的所有部位和其中的器官数据，比较得出四个最小值，传进来的是个对象，其中key为器官所属类别，value为数组
 * */

export function GetTop4AbnormalOrga(wholeBody: any) {
  let allOrgaList: any = [];
  let top4List: any = [];
  if (wholeBody) {
    let tempList = Object.values(wholeBody);
    tempList.map(item => {
      allOrgaList = [...allOrgaList, ...item]
    })
    if (allOrgaList.length > 1) {
      top4List = allOrgaList.sort(CompareScore).slice(0, 4);
      return top4List
    } else {
      return allOrgaList
    }
  }
}


export function CompareScore(obj1: any, obj2: any) {
  let val1 = obj1.score;
  let val2 = obj2.score;
  if (val1 < val2) {
    return -1;
  } else if (val1 > val2) {
    return 1;
  } else {
    return 0;
  }
}


/**
 * 根据后台传来的器官名字，进行映射，映射器官名字，器官图标名字，网格模型的名字，后面可能还会新增
 * */

export function MatchOrga(orgaName: any) {

  let result: any = {orgaName: "", meshName: "", iconName: "icon_胃"};
  const MatchOrigin = {
    "跟骨": {orgaName: "跟骨", meshName: "Retopo_跟骨", iconName: "icon_胃"},
    "腕骨": {orgaName: "腕骨", meshName: "Retopo_腕骨", iconName: "icon_胃"},
    "颈椎": {orgaName: "颈椎", meshName: "Retopo_颈椎", iconName: "icon_胃"},
    "锁骨": {orgaName: "锁骨", meshName: "Retopo_锁骨", iconName: "icon_胃"},
    "颅骨": {orgaName: "颅骨", meshName: "Retopo_颅骨", iconName: "icon_胃"},
    "牙齿_上": {orgaName: "牙齿_上", meshName: "Retopo_牙齿_上", iconName: "icon_胃"},
    "股骨": {orgaName: "股骨", meshName: "Retopo_股骨", iconName: "icon_胃"},
    "腓骨": {orgaName: "腓骨", meshName: "Retopo_腓骨", iconName: "icon_胃"},
    "肱骨": {orgaName: "肱骨", meshName: "Retopo_肱骨", iconName: "icon_胃"},
    "踝关节": {orgaName: "踝关节", meshName: "Retopo_踝关节", iconName: "icon_胃"},
    "下颌骨": {orgaName: "下颌骨", meshName: "Retopo_下颌骨", iconName: "icon_胃"},
    "牙齿_下": {orgaName: "牙齿_下", meshName: "Retopo_牙齿_下", iconName: "icon_胃"},
    "手": {orgaName: "手", meshName: "Retopo_手", iconName: "icon_胃"},
    "脚": {orgaName: "脚", meshName: "Retopo_脚", iconName: "icon_胃"},
    "骨盆": {orgaName: "骨盆", meshName: "Retopo_骨盆", iconName: "icon_胃"},
    "桡骨": {orgaName: "桡骨", meshName: "Retopo_桡骨", iconName: "icon_胃"},
    "肋骨": {orgaName: "肋骨", meshName: "Retopo_肋骨", iconName: "icon_胃"},
    "骶骨": {orgaName: "骶骨", meshName: "Retopo_骶骨", iconName: "icon_胃"},
    "肩胛骨": {orgaName: "肩胛骨", meshName: "Retopo_肩胛骨", iconName: "icon_胃"},
    "胸骨": {orgaName: "胸骨", meshName: "Retopo_胸骨", iconName: "icon_胃"},
    "跗骨": {orgaName: "跗骨", meshName: "Retopo_跗骨", iconName: "icon_胃"},
    "胫骨": {orgaName: "胫骨", meshName: "Retopo_胫骨", iconName: "icon_胃"},
    "尺骨": {orgaName: "尺骨", meshName: "Retopo_尺骨", iconName: "icon_胃"},
    "脊柱": {orgaName: "脊柱", meshName: "Retopo_脊柱", iconName: "icon_胃"},
    "生殖系统": {orgaName: "生殖系统", meshName: "Retopo_生殖系统", iconName: "icon_胃"},
    "静脉": {orgaName: "静脉", meshName: "Retopo_静脉", iconName: "icon_胃"},
    "动脉": {orgaName: "动脉", meshName: "Retopo_动脉", iconName: "icon_胃"},
    "大脑": {orgaName: "大脑", meshName: "Retopo_大脑", iconName: "icon_胃"},
    "消化系统": {orgaName: "消化系统", meshName: "Retopo_消化系统", iconName: "icon_胃"},
    "小肠": {orgaName: "小肠", meshName: "Retopo_小肠", iconName: "icon_小肠"},
    "胃部": {orgaName: "胃部", meshName: "Retopo_胃部", iconName: "icon_胃"},
    "肝脏": {orgaName: "肝脏", meshName: "Retopo_肝脏", iconName: "icon_肝脏"},
    "支气管": {orgaName: "支气管", meshName: "Retopo_支气管", iconName: "icon_胃"},
    "肺": {orgaName: "肺", meshName: "Retopo_肺", iconName: "icon_肺"},
    "肾脏": {orgaName: "肾脏", meshName: "Retopo_肾脏", iconName: "icon_肾"},
    "心脏": {orgaName: "心脏", meshName: "Retopo_心脏", iconName: "icon_心脏"},
    "心脏(动画)": {orgaName: "心脏", meshName: "Retopo_心脏", iconName: "icon_心脏"},
    "皮肤": {orgaName: "皮肤", meshName: "Retopo_皮肤", iconName: "icon_胃"},

    "甲状腺": {orgaName: "甲状腺", meshName: "", iconName: "icon_肾"},
    "垂体": {orgaName: "垂体", meshName: "", iconName: "icon_心脏"},
    "胸腺": {orgaName: "胸腺", meshName: "", iconName: "icon_胃"},

    "心率": {orgaName: "心率", meshName: "", iconName: "icon_心率"},
    "血压": {orgaName: "血压", meshName: "", iconName: "icon_血压"},
    "血糖": {orgaName: "血糖", meshName: "", iconName: "icon_血糖"},
    "BMI": {orgaName: "BMI", meshName: "", iconName: "icon_bmi"},

  };

  return MatchOrigin[`${orgaName}`]

}


/**
 * 将数组中的数据按要求解析成需要的格式，以下两个方法主要用于混合折线图，为该用户和同质人群
 * */

export function RestructurePersonalScore(originList: any) {

  const result: any = {
    XData: [],
    Data: []
  }
  originList.map((origin: any) => {
    result.XData.push(moment(origin.checkup_time).get("years"));
    result.Data.push(origin.score.toFixed(2));

  })

  return result;

}


export function RestructureCommonScore(originList: any, length: any) {
  const result: any = {
    Data: []
  }

  for (let i = 0; i < length; i++) {
    result.Data[i] = originList[0].avg
  }


  return result;
}


export function JudgeHealthRelationship(healthIndex: any) {
  let result: any = {text: "in", desc: "处于", iconType: "greenOne"};
  let flag = 0;

  /**
   * 设定一个flag变量，大于最小就加一，大于最大也加一，小于最大就减一，小于最小-1，为0就是健康的，负数和正数就是不健康
   * */
  if (typeof (healthIndex.score) === "string") {
    let scoreList = healthIndex.score.split("/");
    if (healthIndex.max && scoreList[0] <= healthIndex.max) {
      flag = flag - 1;
    } else {
      flag = flag + 1;
    }

    if (healthIndex.max && scoreList[1] >= healthIndex.min) {
      flag = flag + 1;
    } else {
      flag = flag - 1;
    }

  } else {
    if (healthIndex.min && healthIndex.score >= healthIndex.min) {
      flag = flag + 1;
    } else {
      flag = flag - 1
    }

    if (healthIndex.max && healthIndex.score <= healthIndex.max) {
      flag = flag - 1;
    } else {
      flag = flag + 1
    }

  }

  switch (flag) {
    case 0:
      result = {text: "in", desc: "处于", iconType: "greenOne"};
      break;
    case -1:
    case-2:
      result = {text: "under", desc: "低于", iconType: "yellowOne"};
      break;
    case 1:
    case 2:
      result = {text: "over", desc: "高于", iconType: "yellowOne"};
      break;

  }


  return result;

}


export function MatchIndexAnimaton(orgaName: any, indexName: any) {
// morphTargetInfluences

  const originAllList = {
    "Retopo_跟骨": {},
    "Retopo_腕骨": {},
    "Retopo_颈椎": {},
    "Retopo_锁骨": {},
    "Retopo_颅骨": {},
    "Retopo_牙齿_上": {},
    "Retopo_股骨": {},
    "Retopo_腓骨": {},
    "Retopo_肱骨": {},
    "Retopo_踝关节": {},
    "Retopo_下颌骨": {},
    "Retopo_牙齿_下": {},
    "Retopo_手": {},
    "Retopo_脚": {},
    "Retopo_骨盆": {},
    "Retopo_桡骨": {},
    "Retopo_肋骨": {},
    "Retopo_骶骨": {},
    "Retopo_肩胛骨": {},
    "Retopo_胸骨": {},
    "Retopo_跗骨": {},
    "Retopo_胫骨": {},
    "Retopo_尺骨": {},
    "Retopo_脊柱": {},
    "Retopo_生殖系统": {},
    "Retopo_静脉": {},
    "Retopo_动脉": {},
    "Retopo_大脑": {},
    "Retopo_消化系统": {},
    "Retopo_小肠": {},
    "Retopo_胃部": {},
    "Retopo_肝脏": {},
    "Retopo_支气管": {},
    "Retopo_肺": {},
    "Retopo_肾脏": {},
    "Retopo_心脏": {"异常指标2": "morphTargetInfluences"},
    "Heart__Ani": {},
    "Retopo_皮肤": {},

  };
  let result = null;

  if (originAllList[`${orgaName}`] && originAllList[`${orgaName}`][`${indexName}`]) {
    result = originAllList[`${orgaName}`][`${indexName}`]
  }

  return result;

}


/**
 * 根据传来的用户信息和BMI指数来确定用户的性别和具体类别
 * */

export function JudgeGender(personalInfo: any) {

  let finalGender = "MaleModel";
  let finalModel = "standardFigure.gltf";


  /**
   * 当前的思路是根据BMI与数组的下标所比较，来判断当前的模型类别
   * */
  const genderType: any = [
    {
      genderName: ["男", "male", "Male"],
      modelType: "MaleModel",
    },
    {
      genderName: ["女", "female", "Female"],
      modelType: "FemaleModel",
    },
  ];

  /**
   * 在这里定义一个取值范围，左闭右开，或者左开右闭都是可以的
   * */

  const modelType: any = [
    {BMIRank: [3.0, 4.0], modelName: "standardFigure.gltf"},
    {BMIRank: [4.0, 5.0], modelName: "overWeightFigure.gltf"},
    {BMIRank: [5.0, 6.0], modelName: "fatFigure.gltf"},
    {BMIRank: [2.0, 3.0], modelName: "tooLightFigure.gltf"},
    {BMIRank: [1.0, 2.0], modelName: "superLightFigure.gltf"},
  ];


  if (personalInfo.gender) {
    genderType.map((item: any) => {
      if (item.genderName.indexOf(personalInfo.gender) != -1) {
        finalGender = item.modelType;

      }
    })
  }

  if (personalInfo.BMI) {
    modelType.map((item: any) => {
      if (item.BMIRank[0] <= personalInfo.BMI && item.BMIRank[1] > personalInfo.BMI) {
        finalModel = item.modelName;
      }
    })

  }


  return {finalGender, finalModel}

}


/**
 * 根据传来的器官名字，确定所属部位
 * */

export function GetOrgaParent(orgaName: any) {

  const allPartDetails: any = {
    "腹部": ["胃",
      "小肠",
      "肠黏膜",
      "肝脏",
      "大肠",
      "肛",
      "肾脏",
      "输尿管",
      "膀胱",
      "尿道",
      "血-尿屏障",
      "血-睾屏障",
      "腰椎关节",
      "腰骨和腰肌",
      "睾丸",
      "附睾",
      "输精管",
      "射精管",
      "前列腺",
      "男性外生殖器",
      "卵巢",
      "输卵管",
      "子宫",
      "女性阴道",
      "女性外生殖器",
    ],
    "全身": ["血管",
      "全身（组织）",
      "骨骼肌",
      "脂肪",
      "皮肤",
      "皮下组织",
      "粘膜",
      "毛发",
      "指甲",
      "抵抗感染组织",
      "免疫监视组织",
      "自身稳定组织",
      "内脏",
      "骨骼肌等",
    ],
    "上肢": ["肩关节",
      "肩骨和肩肌",
      "肘关节",
      "肘骨和肘肌",
      "腕关节",
      "腕骨和腕肌",
      "掌指关节",
      "掌指骨和掌指肌",
    ],
    "神经": ["视觉中枢神经通路",
      "听觉中枢神经通路",
      "嗅觉中枢神经通路",
      "味觉中枢神经通路",
      "浅感觉中枢神经通路",
      "平衡觉中枢神经通路",
      "机体觉中枢神经通路",
      "中枢神经系统",
      "周围神经系统",
    ],
    "头面部": ["口",
      "咽",
      "喉和会厌",
      "鼻",
      "血-脑屏障",
      "颅盖",
      "血-眼屏障",
      "左眼",
      "右眼",
      "左耳",
      "右耳",
      "鼻嗅觉感受功能",
      "舌",
      "内耳（平衡觉）",
      "面部关节",
      "面部骨骼与面部肌肉",
      "颈椎关节",
      "颈骨和颈肌",
      "脑",
      "脑（视觉认知功能）",
      "脑（听觉认知功能）",
      "脑（触觉认知功能）",
      "脑（定向力功能）",
      "脑（目的行为运动协调功能）",
      "脑（思维功能）",
      "脑（智能功能）",
    ],
    "下肢": ["髋关节",
      "髋骨和髋肌",
      "骨盆关节",
      "骨盆骨和骨盆肌",
      "膝关节",
      "膝骨和膝肌",
      "足关节",
      "足骨和足肌",
    ],
    "胸部": ["食管",
      "心脏",
      "肺脏",
      "支气管",
      "气管",
      "血-气屏障",
      "血-胸腺屏障",
      "胸椎关节",
      "胸骨和胸肌",
      "乳房",
    ],
  };
  let partName: any;

  for (const p in allPartDetails) {
    if (allPartDetails[p].indexOf(orgaName) !== -1) {
      partName = p;
    }
  }


  return partName;

}


/**
 * 根据传来的器官数组，再每个器官中加一个属性，组织，或者将他们分类成某个部位,
 * 返回两种结果，一类时给数组中的每个元素增加一个部位属性（newOrgaList），另一个是将他们格式化成需要的格式（orgaObject）
 * */


export function RestructureOrgaList(orgaList: any){

  /**
   * 给器官列表增加身体部位
   * */
  const newOrgaList=JSON.parse(JSON.stringify(orgaList));

  const orgaObject=new Object();

  if (Array.isArray(newOrgaList) && newOrgaList.length>0){
    newOrgaList.map((orga: any)=>{
      const partName=GetOrgaParent(orga.orgaName);
      orga.parName=partName;
      if (orgaObject[`${partName}`]){
        orgaObject[`${partName}`].push(orga)
      }else{
        orgaObject[`${partName}`]=[orga];

      }
    })
  }

  return {newOrgaList, orgaObject}

}
