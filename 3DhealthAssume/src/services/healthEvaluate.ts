/**

 * @author MikyMei

 * @date 2022-01-07 13:49

 */


import {request} from 'umi';

const headers = {
  Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjQyMTQ1MzM1LCJqdGkiOiIyMmNkM2Q3M2M2OTc0OWY3ODBlNTc4N2IxY2QzNDM4MyIsInVzZXJfaWQiOjN9.ICsegk7iRf4Mv9Orlp4bl_tOlXNFIm_gBOmpwxXpsXQ'
}


/**
 * 携带的token，一周有效，测试账号：test01， 密码：1233456
 *
 * */
// const  headers= {"Authorization": "Bearer" +" "+"IuRp3mTXp9djH9aVIQLxFdnTKH1VVDaNkVaOdKSBrJVV5giwBcV0blW1gs1oYJ8X"};

export async function GetPersonalHealthInfo(params: any) {


  return request('/api2/health/3d/user_basic_info/', {
    method: 'GET',
    params,
    headers

  });
}

export async function GetAllOrgaList(params: any) {
  return {
    code: 2000,
    data: [
      {
        "上身部位": [
          {name: "皮肤", exceptionCount: 4, score: 68}
        ],
        "骨骼部位": [
          {name: "跟骨", exceptionCount: 1, score: 51},
          {name: "腕骨", exceptionCount: 2, score: 52},
          {name: "颈椎", exceptionCount: 3, score: 53},
          {name: "锁骨", exceptionCount: 4, score: 54},
          {name: "颅骨", exceptionCount: 5, score: 55},
          {name: "牙齿_上", exceptionCount: 6, score: 56},
          {name: "股骨", exceptionCount: 7, score: 57},
          {name: "腓骨", exceptionCount: 8, score: 58},
          {name: "肱骨", exceptionCount: 9, score: 59},
          {name: "踝关节", exceptionCount: 1, score: 60},
          {name: "下颌骨", exceptionCount: 2, score: 61},
          {name: "牙齿_下", exceptionCount: 3, score: 62},
          {name: "手", exceptionCount: 4, score: 63},
          {name: "脚", exceptionCount: 5, score: 64},
          {name: "骨盆", exceptionCount: 6, score: 65},
          {name: "桡骨", exceptionCount: 7, score: 66},
          {name: "肋骨", exceptionCount: 8, score: 67},
          {name: "骶骨", exceptionCount: 9, score: 68},
          {name: "肩胛骨", exceptionCount: 1, score: 69},
          {name: "胸骨", exceptionCount: 2, score: 70},
          {name: "跗骨", exceptionCount: 3, score: 71},
          {name: "胫骨", exceptionCount: 4, score: 72},
          {name: "尺骨", exceptionCount: 5, score: 73},
          {name: "脊柱", exceptionCount: 6, score: 74},

        ],
        "内脏部位": [
          {name: "生殖系统", exceptionCount: 1, score: 51},
          {name: "静脉", exceptionCount: 2, score: 52},
          {name: "动脉", exceptionCount: 3, score: 53},
          {name: "大脑", exceptionCount: 4, score: 54},
          {name: "消化系统", exceptionCount: 5, score: 55},
          {name: "小肠", exceptionCount: 6, score: 56},
          {name: "胃部", exceptionCount: 7, score: 57},
          {name: "肝脏", exceptionCount: 8, score: 58},
          {name: "支气管", exceptionCount: 9, score: 59},
          {name: "肺", exceptionCount: 1, score: 60},
          {name: "肾脏", exceptionCount: 2, score: 61},
          {name: "心脏", exceptionCount: 3, score: 62},

        ],
        "全身性器官": [
          {name: "甲状腺", exceptionCount: 1, score: 51},
          {name: "垂体", exceptionCount: 2, score: 52},
          {name: "胸腺", exceptionCount: 3, score: 53},


        ]


      }]
  }

  // return request('/api2/getAllPermissionList', {
  //   method: 'GET',
  //   params,
  // });
}

export async function GetPersonalScoreHistory(params: any) {

  return request('/api2/health/health/user_year_score_chart/', {
    method: 'GET',
    params,
    headers
  });
}

//
export async function GetCommonScoreHistory(params: any) {

  return request('/api2/health/health/avg_score_total/', {
    method: 'GET',
    params,
    headers
  });
}

//
export async function GetKeyHealthIndex(params: any) {

  const data = [
    {
      name: "心率得分",
      min: 55,
      max: 105,
      score: 55,
    },
    {
      name: "血压得分",
      max: 120 / 50,
      min: 100 / 80,
      score: 120 / 80,
    },
    {
      name: "血糖得分",
      min: 4.0,
      max: 7.0,
      score: 6.5,
    },
    {
      name: "BMI",
      min: 4.0,
      max: 7.0,
      score: 6.5,
    },
  ]

  return {code: 200, data};

  // return request('/api2/health/health/avg_score_total/', {
  //   method: 'GET',
  //   params,
  // });
}

export async function AddNewRole(params: any) {
  // return request('/api2/account/permission/manage/', {
  //   method: 'POST',
  //   data: params,
  // });
}


/**
 * 下面的两个方法，都是获得器官的得分历史和同质人群的历史得分
 * */
export async function GetOrgaScoreHistory() {

  return {
    code: 200,
    data: [
      {
        "checkup_id": 1636690,
        "checkup_time": "2017-12-08",
        "score": 94,
      },
      {
        "checkup_id": 1636691,
        "checkup_time": "2018-12-08",
        "score": 91,
      },
      {
        "checkup_id": 1636692,
        "checkup_time": "2019-12-08",
        "score": 92,
      },
      {
        "checkup_id": 1636692,
        "checkup_time": "2020-12-08",
        "score": 93,
      },
      {
        "checkup_id": 1636692,
        "checkup_time": "2021-12-08",
        "score": 96,
      }
    ]
  }

}


export async function GetOrgaCommonScoreHistory() {

  return {
    code: 200,
    data: [
      {
        "avg": 78.34
      }
    ]
  }
}


export async function GetOrgaDetailInfo(params: any) {
  return {
    code: 200,
    data: [
      {
        name: params.orgaName,
        desc: "这是一段相关的器官描述，有后台传过来",
        orgaPicture: [
          "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fnimg.ws.126.net%2F%3Furl%3Dhttp%253A%252F%252Fdingyue.ws.126.net%252F2021%252F1101%252F04b2a765j00r1v3t0000kc000cy00cyc.jpg%26thumbnail%3D650x2147483647%26quality%3D80%26type%3Djpg&refer=http%3A%2F%2Fnimg.ws.126.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1644569985&t=f21fa8d0b5c762e2828aa76c5ba08869",
          "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Finews.gtimg.com%2Fnewsapp_bt%2F0%2F10474177116%2F1000.jpg&refer=http%3A%2F%2Finews.gtimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1644570012&t=d0ecd4ca78873c88cadb40eab6215047",
          "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fp9.itc.cn%2Fimages01%2F20210611%2Fa2ad1613d0944d55ab1f462f4105f877.png&refer=http%3A%2F%2Fp9.itc.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1644570058&t=f1916a151febb1f6359dd9a71c613cce"

        ],
        illType: [
          {
            illName: "异常指标1",
            illDesc: "这是一段有关异常标识一的描述"
          },
          {
            illName: "异常指标2",
            illDesc: "这是一段有关异常标识二的描述"
          }
        ],

      }
    ]
  }

  /*
  *
  *   return request('/api2/health/health/avg_score_total/', {
    method: 'GET',
    params,
    headers
  });
  *
  * */
}
