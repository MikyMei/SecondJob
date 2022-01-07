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
        {name:"心脏", exceptionCount:4, score:68}
      ],
        "身体部位":[
          {name:"皮肤", exceptionCount:4, score:70},
          {name:"骨骼", exceptionCount:4, score:55},
        ],
        "内脏部位":[
          {name:"十二指肠", exceptionCount:4, score:80},

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

  return data;

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
