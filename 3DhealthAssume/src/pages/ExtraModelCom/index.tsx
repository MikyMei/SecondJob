/**

 * @author MikyMei

 * @date 2021-11-22 15:14

 */


import React, {useEffect, useState, useRef} from 'react';
import styles from './index.less'
import BodyModel from "@/pages/ExtraModelCom/Components/BodyMOdel";
import {Avatar, Badge, Carousel, Col, Divider, Row, Tag, Tooltip} from "antd";
import {AntDesignOutlined, CloseCircleOutlined} from "@ant-design/icons";
import {connect, Dispatch} from "umi";


const NormalProject: React.FC = (props: { bodyModelInfo: any, dispatch: Dispatch }) => {

  const {bodyModelInfo, dispatch} = props;

  const {
    personalInfo,
    allOrgaList,
    personalHealthScore,
    personalScoreHistory,
    commonScoreHistory,
    keyHealthIndex,
    abnormalOrgaTop4,
    abnormalOrgaTop4Detail
  } = bodyModelInfo;

  // console.log(orgaName, orgaDesc, illList, newInfoDisplay, newInfoTop, newInfoRight);

  const bodyRef = useRef(null);
  const [currentOrga, setCurrentOrga] = useState<any>('');
  const [orgaDescription, setOrgaDescription] = useState<any>('');
  const [illTypeList, setIlltypelist] = useState<any>([]);
  const [bodyModel, setBodyModel] = useState<any>();


  const enlargeItem = async (value: any) => {
    bodyRef.current.testEnlarge(value);

  }


  useEffect(() => {
    setBodyModel(<BodyModel onRef={bodyRef} orgaDescription={orgaDescription} currentOrga={currentOrga}
                            illtypelist={illTypeList}>
    </BodyModel>)
  }, [])


  useEffect(() => {
    GetAllBodyHealth();
  }, [])

  /*
  * 当获得了top4一场器官的时候，再去分别获得详细信息
  * */

  useEffect(() => {

    /**
     * 当第一次进入页面加载的时候，获得了个人健康所需的数据，就动态生成这些内容，
     * 主要有个人信息生成
     * 器官卡片生成
     * 健康信息生成
     * 四个指标生成
     * 异常气管生成
     * */



  }, [abnormalOrgaTop4]);

  /**
   *
   * */




  const GetAllBodyHealth = () => {
    if (dispatch) {
      const params = {
        personalHealthInfoParams: {
          user_id: "2017014713"
        },
        personalScoreHistoryParams: {
          user_id: "2017014713"
        },

        keyHealthIndexParams: {
          user_id: "2017014713"
        },
      }
      dispatch({
        type: "bodyModel/getAllPersonalHealthInformation",
        payload: {
          params,
        }
      })
    }
  }


  return (
    <div className={styles.mainContainer}>
      {bodyModel}
      <div className={styles.siderColoumn}>
        <div className={styles.userCard}>

        </div>
        <div className={styles.orgaList}></div>

      </div>


    </div>
  )
}

// export default NormalProject;

export default connect(({bodyModel}) => ({
  bodyModelInfo: bodyModel,
}))(NormalProject);
