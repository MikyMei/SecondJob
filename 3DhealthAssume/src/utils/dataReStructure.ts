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

  // 修改了器官模型的（meshname）的名字，具体器官的名字还没有对应方法学的
  const MatchOrigin2 = {
    "胃": {orgaName: "胃", meshName: ["胃", "面片_胃_胃炎","面片_胃_胃癌", "面片_胃_胃溃疡", "胃_剖面"], iconName: "icon_胃"},
    "小肠": {orgaName: "小肠", meshName: ["小肠，肠黏膜"], iconName: "icon_小肠"},
    "肝脏": {orgaName: "肝脏", meshName: ["肝脏"], iconName: "icon_肝脏"},
    "大肠": {orgaName: "大肠", meshName: ["大肠"], iconName: "icon_胃"},
    "肛": {orgaName: "肛", meshName: ["肛"], iconName: "icon_胃"},
    "肾脏": {orgaName: "肾脏", meshName: ["肾脏，血_尿屏障"], iconName: "icon_肾"},
    "输尿管": {orgaName: "输尿管", meshName: ["输尿管"], iconName: "icon_胃"},
    "膀胱": {orgaName: "膀胱", meshName: ["膀胱"], iconName: "icon_胃"},
    "尿道": {orgaName: "尿道", meshName: ["尿道"], iconName: "icon_胃"},
    "腰椎关节": {orgaName: "腰椎关节", meshName: ["腰椎关节，腰椎"], iconName: "icon_胃"},
    "腰肌": {orgaName: "腰肌", meshName: ["腰肌，腰椎"], iconName: "icon_胃"},
    "睾丸": {orgaName: "睾丸", meshName: ["睾丸，血_睾屏障"], iconName: "icon_胃"},
    "附睾": {orgaName: "睾丸", meshName: ["睾丸，血_睾屏障，附睾"], iconName: "icon_胃"},
    "输精管": {orgaName: "输精管", meshName: ["输精管，射精管"], iconName: "icon_胃"},
    "前列腺": {orgaName: "前列腺", meshName: ["前列腺"], iconName: "icon_胃"},
    "血管": {orgaName: "血管", meshName: ["血管"], iconName: "icon_胃"},
    "肩关节": {orgaName: "肩关节", meshName: ["肩关节"], iconName: "icon_胃"},
    "肩肌": {orgaName: "肩肌", meshName: ["肩肌，肩关节"], iconName: "icon_胃"},
    "肘肌": {orgaName: "肘肌", meshName: ["肘肌，手肘"], iconName: "icon_胃"},
    "手肘": {orgaName: "手肘", meshName: ["手肘"], iconName: "icon_胃"},
    "手腕": {orgaName: "手腕", meshName: ["手腕"], iconName: "icon_胃"},
    "手指": {orgaName: "手指", meshName: ["手指"], iconName: "icon_胃"},
    "中枢神经系统": {orgaName: "中枢神经系统", meshName: ["中枢神经系统"], iconName: "icon_胃"},
    "周围神经系统": {orgaName: "周围神经系统", meshName: ["周围神经系统"], iconName: "icon_胃"},
    "牙": {orgaName: "牙", meshName: ["牙，口"], iconName: "icon_胃"},
    "口": {orgaName: "口", meshName: ["口，舌"], iconName: "icon_胃"},
    "咽": {orgaName: "咽", meshName: ["咽"], iconName: "icon_胃"},
    "喉和会厌": {orgaName: "喉和会厌", meshName: ["喉和会厌"], iconName: "icon_胃"},
    "鼻": {orgaName: "鼻", meshName: ["鼻，头颈部"], iconName: "icon_胃"},
    "血_脑屏障": {orgaName: "血_脑屏障", meshName: ["血_脑屏障，中枢神经系统，脑"], iconName: "icon_胃"},
    "头颈部": {orgaName: "头颈部", meshName: ["头颈部，颅盖"], iconName: "icon_胃"},
    "血_眼屏障": {orgaName: "血_眼屏障", meshName: ["血_眼屏障，眼"], iconName: "icon_胃"},
    "耳": {orgaName: "耳", meshName: ["耳"], iconName: "icon_胃"},
    "面部关节": {orgaName: "面部关节", meshName: ["面部关节，头颈部"], iconName: "icon_胃"},
    "面部肌肉": {orgaName: "面部肌肉", meshName: ["面部肌肉，头颈部"], iconName: "icon_胃"},
    "颈肌": {orgaName: "颈肌", meshName: ["颈肌，颈椎"], iconName: "icon_胃"},
    "颈椎": {orgaName: "颈椎", meshName: ["颈椎"], iconName: "icon_胃"},
    "髋肌": {orgaName: "髋肌", meshName: ["髋肌，髋部"], iconName: "icon_胃"},
    "髋部": {orgaName: "髋部", meshName: ["骨盆，髋部"], iconName: "icon_胃"},
    "骶骨": {orgaName: "骶骨", meshName: ["骨盆，骶骨，髋部"], iconName: "icon_胃"},
    "骨盆肌": {orgaName: "骨盆肌", meshName: ["骨盆肌"], iconName: "icon_胃"},
    "股骨": {orgaName: "股骨", meshName: ["股骨，髋部，膝关节"], iconName: "icon_胃"},
    "膝关节": {orgaName: "膝关节", meshName: ["膝关节"], iconName: "icon_胃"},
    "膝肌": {orgaName: "膝肌", meshName: ["膝肌，膝关节"], iconName: "icon_胃"},
    "足关节": {orgaName: "足关节", meshName: ["足关节"], iconName: "icon_胃"},
    "食管": {orgaName: "食管", meshName: ["食管"], iconName: "icon_胃"},
    "心脏": {orgaName: "心脏", meshName: ["心脏", "心脏_"], iconName: "icon_心脏"},
    "肺脏": {orgaName: "肺脏", meshName: ["肺脏，血_气屏障"], iconName: "icon_肺"},
    "支气管": {orgaName: "支气管", meshName: ["支气管"], iconName: "icon_胃"},
    "气管": {orgaName: "气管", meshName: ["气管"], iconName: "icon_胃"},
    "血_胸腺屏障": {orgaName: "血_胸腺屏障", meshName: ["血_胸腺屏障"], iconName: "icon_胃"},
    "胸椎": {orgaName: "胸椎", meshName: ["胸椎"], iconName: "icon_胃"},
    "皮肤": {orgaName: "皮肤", meshName: ["全身_1"], iconName: "icon_胃"},

    "心率": {orgaName: "心率", meshName: "", iconName: "icon_心率"},
    "血压": {orgaName: "血压", meshName: "", iconName: "icon_血压"},
    "血糖": {orgaName: "血糖", meshName: "", iconName: "icon_血糖"},
    "BMI": {orgaName: "BMI", meshName: "", iconName: "icon_bmi"},

  };


  return MatchOrigin2[`${orgaName}`]

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
    {BMIRank: [2.0, 3.0], modelName: "thinnerFigure.gltf"},
    {BMIRank: [1.0, 2.0], modelName: "superLightFigure.gltf"},
    {BMIRank: [3.0, 4.0], modelName: "standardFigure.gltf"},
    {BMIRank: [4.0, 5.0], modelName: "overWeightFigure.gltf"},
    {BMIRank: [5.0, 6.0], modelName: "fatFigure.gltf"},

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
    "腹部": [
      "膀胱",
      "肠黏膜",
      "大肠",
      "附睾",
      "肝脏",
      "肛",
      "睾丸",
      "卵巢",
      "男性外生殖器",
      "尿道",
      "女性外生殖器",
      "女性阴道",
      "前列腺",
      "射精管",
      "肾脏",
      "输精管",
      "输卵管",
      "输尿管",
      "胃",
      "小肠",
      "血-睾屏障",
      "血-尿屏障",
      "腰骨和腰肌",
      "腰椎关节",
      "子宫",
    ],
    "全身": [
      "抵抗感染组织",
      "骨骼肌",
      "骨骼肌等",
      "毛发",
      "免疫监视组织",
      "内脏",
      "皮肤",
      "皮下组织",
      "全身（组织）",
      "血管",
      "粘膜",
      "脂肪",
      "指甲",
      "自身稳定组织",],
    "上肢": [
      "肩骨和肩肌",
      "肩关节",
      "腕骨和腕肌",
      "腕关节",
      "掌指骨和掌指肌",
      "掌指关节",
      "肘骨和肘肌",
      "肘关节",],
    "神经": [
      "机体觉中枢神经通路",
      "平衡觉中枢神经通路",
      "浅感觉中枢神经通路",
      "视觉中枢神经通路",
      "听觉中枢神经通路",
      "味觉中枢神经通路",
      "嗅觉中枢神经通路",
      "中枢神经系统",
      "周围神经系统",
    ],
    "头面部": [
      "鼻",
      "鼻嗅觉感受功能",
      "喉和会厌",
      "颈骨和颈肌",
      "颈椎关节",
      "口",
      "颅盖",
      "面部骨骼与面部肌肉",
      "面部关节",
      "脑",
      "脑（触觉认知功能）",
      "脑（定向力功能）",
      "脑（目的行为运动协调功能）",
      "脑（视觉认知功能）",
      "脑（思维功能）",
      "脑（听觉认知功能）",
      "脑（智能功能）",
      "内耳（平衡觉）",
      "舌",
      "血-脑屏障",
      "血-眼屏障",
      "咽",
      "右耳",
      "右眼",
      "左耳",
      "左眼",
    ],
    "下肢": [
      "骨盆骨和骨盆肌",
      "骨盆关节",
      "髋骨和髋肌",
      "髋关节",
      "膝骨和膝肌",
      "膝关节",
      "足骨和足肌",
      "足关节",
    ],
    "胸部": [
      "肺脏",
      "气管",
      "乳房",
      "食管",
      "心脏",
      "胸骨和胸肌",
      "胸椎关节",
      "血-气屏障",
      "血-胸腺屏障",
      "支气管",
    ],

  }

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


export function RestructureOrgaList(orgaList: any) {

  /**
   * 给器官列表增加身体部位
   * */
  const newOrgaList = JSON.parse(JSON.stringify(orgaList));

  const orgaObject = new Object();

  if (Array.isArray(newOrgaList) && newOrgaList.length > 0) {
    newOrgaList.map((orga: any) => {
      const partName = GetOrgaParent(orga.orgaName);
      orga.parName = partName;
      if (orgaObject[`${partName}`]) {
        orgaObject[`${partName}`].push(orga)
      } else {
        orgaObject[`${partName}`] = [orga];

      }
    })
  }

  return {newOrgaList, orgaObject}

}

/**
 * 判断一个元素是否存在二维数组中
 * 参数为二维数组，和一个字符传
 * */

export function JudgeExisted(listArray: any, orgaName: any) {

  let result = false;
  let count=0;

  if (listArray.length === 0) {
    result = false
  } else {
    listArray.map((item: any) => {
      if (item.includes(orgaName)){
        count++;
      }
    })

    if (count>0){
      result=true;
    }


  }

  return result;

}
