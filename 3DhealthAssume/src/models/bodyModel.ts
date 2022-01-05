import {Effect, Reducer} from 'umi';
import {Row, Tag} from "antd";
import styles from "@/pages/ExtraModelCom/index.less";
import React from "react";


export type StateType = {
  orgaName?: any;
  orgaDesc?: any;
  illList?: any;
  infoDisplay?: any;
  infoTop?: any;
  infoRight?: any;


};

export type ModelType = {
  namespace: string;
  state: StateType;
  effects: {
    changeOrgaInfo: Effect;

  };
  reducers: {
    initOrgaInfo: Reducer<StateType>;
    initInfoWindow: Reducer<StateType>;
    initIllList: Reducer<StateType>;

  };
};

const Model: ModelType = {
  namespace: 'bodyModel',

  state: {
    orgaName: '55',
    orgaDesc: '55',
    illList: {},
    infoDisplay:'none',
    infoTop: "50px",
    infoRight: "50px",
  },

  effects: {
    * changeOrgaInfo({payload}, {call, put}) {

    }
  },

  reducers: {

    initOrgaInfo(state, {payload}) {
      return {
        ...state,
        orgaName: payload.newOrgaName,
        orgaDesc: payload.newOrgaDesc,
        illList: payload.newIllList,
      };
    },
    initIllList(state, {payload}) {
      return {
        ...state,
        illList: payload.newIllList,
      };
    },
    initInfoWindow(state, {payload}) {
      const bodyPart = {
        Body002: "包在身体表面，直接同外界环境接触，具有保护、排泄、调节体温和感受外界刺激等作用的一种器官，是人的身体器官中最大的器官",
        Circulatory_Heart001: "心脏主要功能是为血液流动提供动力，把血液运行至身体各个部分。人类的心脏位于胸腔中部偏左下方，体积约相当于一个拳头大小，重量约250克。女性的心脏通常要比男性的体积小且重量轻",
        Skeletal001: "人或动物体内或体表坚硬的组织。分内骨骼和外骨骼两种，人和高等动物的骨骼在体内，由许多块骨头组成，叫内骨骼；软体动物体外的硬壳以及某些脊椎动物（如鱼、龟等）体表的鳞、甲等叫外骨骼。",

      }
      const contentlist1: any = [];
      contentlist1.push({
        illType:"肺占位性病变",
        illDesc:"占位性病变通常泛指肿瘤（良性的、恶性的）、寄生虫等，而不涉及疾病的病因。"
      })
      contentlist1.push({
        illType:"肺占位性病变",
        illDesc:"占位性病变通常泛指肿瘤（良性的、恶性的）、寄生虫等，而不涉及疾病的病因。"
      })


      return {
        ...state,
        infoDisplay: payload.newInfoDisplay,
        infoTop: payload.newInfoTop,
        infoRight: payload.newInfoRight,
        orgaName: payload.newOrgaName,
        orgaDesc: bodyPart[`${payload.newOrgaName}`],
        illList: contentlist1,
      };
    },

  },
};

export default Model;

