/**

 * @author MikyMei

 * @date 2022-01-10 13:51

 */


/**
 * 传入接口请求来的所有部位和其中的器官数据，比较得出四个最小值，传进来的是个对象，其中key为器官所属类别，value为数组
 * */

export function GetTop4AbnormalOrga(wholeBody: any) {
  let  allOrgaList:any=[];
  let top4List:any=[];
 if (wholeBody){
   let tempList=Object.values(wholeBody);
   tempList.map(item=>{
     allOrgaList=[...allOrgaList,...item]
   })
   if (allOrgaList.length>1){
     top4List=allOrgaList.sort(CompareScore).slice(0,4);
     return top4List
   }else{
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

