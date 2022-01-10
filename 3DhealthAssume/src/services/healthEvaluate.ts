/**

 * @author MikyMei

 * @date 2022-01-07 13:49

 */


import { request } from 'umi';

const headers={
    Authorization:'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjQyMTQ1MzM1LCJqdGkiOiIyMmNkM2Q3M2M2OTc0OWY3ODBlNTc4N2IxY2QzNDM4MyIsInVzZXJfaWQiOjN9.ICsegk7iRf4Mv9Orlp4bl_tOlXNFIm_gBOmpwxXpsXQ'
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
    code:2000,
    data: [
      {
      "上身部位":[
        {name:"Retopo_皮肤", exceptionCount:4, score:68}
      ],
        "骨骼部位":[
          {name:"Retopo_跟骨",	exceptionCount:	1	, score:	51	},
          {name:"Retopo_腕骨",	exceptionCount:	2	, score:	52	},
          {name:"Retopo_颈椎",	exceptionCount:	3	, score:	53	},
          {name:"Retopo_锁骨",	exceptionCount:	4	, score:	54	},
          {name:"Retopo_颅骨",	exceptionCount:	5	, score:	55	},
          {name:"Retopo_牙齿_上",	exceptionCount:	6	, score:	56	},
          {name:"Retopo_股骨",	exceptionCount:	7	, score:	57	},
          {name:"Retopo_腓骨",	exceptionCount:	8	, score:	58	},
          {name:"Retopo_肱骨",	exceptionCount:	9	, score:	59	},
          {name:"Retopo_踝关节",	exceptionCount:	1	, score:	60	},
          {name:"Retopo_下颌骨",	exceptionCount:	2	, score:	61	},
          {name:"Retopo_牙齿_下",	exceptionCount:	3	, score:	62	},
          {name:"Retopo_手",	exceptionCount:	4	, score:	63	},
          {name:"Retopo_脚",	exceptionCount:	5	, score:	64	},
          {name:"Retopo_骨盆",	exceptionCount:	6	, score:	65	},
          {name:"Retopo_桡骨",	exceptionCount:	7	, score:	66	},
          {name:"Retopo_肋骨",	exceptionCount:	8	, score:	67	},
          {name:"Retopo_骶骨",	exceptionCount:	9	, score:	68	},
          {name:"Retopo_肩胛骨",	exceptionCount:	1	, score:	69	},
          {name:"Retopo_胸骨",	exceptionCount:	2	, score:	70	},
          {name:"Retopo_跗骨",	exceptionCount:	3	, score:	71	},
          {name:"Retopo_胫骨",	exceptionCount:	4	, score:	72	},
          {name:"Retopo_尺骨",	exceptionCount:	5	, score:	73	},
          {name:"Retopo_脊柱",	exceptionCount:	6	, score:	74	},

        ],
        "内脏部位":[
          {name:"Retopo_生殖系统",	exceptionCount:	1	, score:	51	},
          {name:"Retopo_静脉",	exceptionCount:	2	, score:	52	},
          {name:"Retopo_动脉",	exceptionCount:	3	, score:	53	},
          {name:"Retopo_大脑",	exceptionCount:	4	, score:	54	},
          {name:"Retopo_消化系统",	exceptionCount:	5	, score:	55	},
          {name:"Retopo_小肠",	exceptionCount:	6	, score:	56	},
          {name:"Retopo_胃部",	exceptionCount:	7	, score:	57	},
          {name:"Retopo_肝脏",	exceptionCount:	8	, score:	58	},
          {name:"Retopo_支气管",	exceptionCount:	9	, score:	59	},
          {name:"Retopo_肺",	exceptionCount:	1	, score:	60	},
          {name:"Retopo_肾脏",	exceptionCount:	2	, score:	61	},
          {name:"Retopo_心脏",	exceptionCount:	3	, score:	62	},


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

  const data=[
    {
    name: "心率得分",
    min:55,
    max:105,
    score:55,
  },
    {
      name: "血压得分",
      max:120/50,
      min:100/80,
      score:120/80,
    },
    {
      name: "血糖得分",
      min:4.0,
      max:7.0,
      score:6.5,
    },
    {
      name: "BMI",
      min:4.0,
      max:7.0,
      score:6.5,
    },
  ]

  return {code:200, data};

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
    code:200,
    data:[
      {
        "checkup_id":1636690,
        "checkup_time":"2017-12-08",
        "score":94,
      },
      {
        "checkup_id":1636691,
        "checkup_time":"2018-12-08",
        "score":91,
      },
      {
        "checkup_id":1636692,
        "checkup_time":"2019-12-08",
        "score":92,
      },
      {
        "checkup_id":1636692,
        "checkup_time":"2020-12-08",
        "score":93,
      },
      {
        "checkup_id":1636692,
        "checkup_time":"2021-12-08",
        "score":96,
      }
    ]
  }

}


export async function GetOrgaCommonScoreHistory() {

  return {
    code:200,
    data:[
      {
        "avg":78.34
      }
    ]
  }
}

