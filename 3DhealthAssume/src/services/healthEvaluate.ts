/**

 * @author MikyMei

 * @date 2022-01-07 13:49

 */


import { request } from 'umi';



/**
 * 携带的token，一周有效，测试账号：test01， 密码：1233456
 *
 * */
// const  headers= {"Authorization": "Bearer" +" "+"IuRp3mTXp9djH9aVIQLxFdnTKH1VVDaNkVaOdKSBrJVV5giwBcV0blW1gs1oYJ8X"};

export async function GetPersonalHealthInfo(params: any) {


  return request('/api2/health/3d/user_basic_info/', {
    method: 'GET',
    params,

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
  });
}


export async function AddNewRole(params: any) {
  // return request('/api2/account/permission/manage/', {
  //   method: 'POST',
  //   data: params,
  // });
}
