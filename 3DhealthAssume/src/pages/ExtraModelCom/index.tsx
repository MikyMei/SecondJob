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

  const {orgaName, orgaDesc, illList, infoDisplay, infoTop, infoRight,} = bodyModelInfo;

  // console.log(orgaName, orgaDesc, illList, newInfoDisplay, newInfoTop, newInfoRight);

  const bodyRef = useRef(null);
  const [currentOrga, setCurrentOrga] = useState<any>('');
  const [orgaDescription, setOrgaDescription] = useState<any>('');
  const [illTypeList, setIlltypelist] = useState<any>([]);
  const [bodyModel, setBodyModel] = useState<any>();

  const bodyPart = {
    Body002: "包在身体表面，直接同外界环境接触，具有保护、排泄、调节体温和感受外界刺激等作用的一种器官，是人的身体器官中最大的器官",
    Circulatory_Heart001: "心脏主要功能是为血液流动提供动力，把血液运行至身体各个部分。人类的心脏位于胸腔中部偏左下方，体积约相当于一个拳头大小，重量约250克。女性的心脏通常要比男性的体积小且重量轻",
    Skeletal001: "人或动物体内或体表坚硬的组织。分内骨骼和外骨骼两种，人和高等动物的骨骼在体内，由许多块骨头组成，叫内骨骼；软体动物体外的硬壳以及某些脊椎动物（如鱼、龟等）体表的鳞、甲等叫外骨骼。",

  }


  const enlargeItem = async (value: any) => {
    const contentlist1: any = [];
    contentlist1.push(
      <div key={1}>
        <Row className={styles.illType}>
          <Tag color="orange">肺占位性病变{value ? value : ""}</Tag>
        </Row>
        <Row className={styles.illDesc}>占位性病变通常泛指肿瘤（良性的、恶性的）、寄生虫等，而不涉及疾病的病因。
          人和高等动物的呼吸器官。人的肺在胸腔内,左右各一,和支气管相连。
          人和高等动物的呼吸器官。人的肺在胸腔内,左右各一,和支气管相连。 人和高等动物的呼吸器官。人的肺在胸腔内,左右各一,和支气管相连。</Row>
      </div>
    )
    contentlist1.push(
      <div key={2}>
        <Row className={styles.illType}>
          <Tag color="orange">肺占位性病变</Tag>
        </Row>
        <Row className={styles.illDesc}>占位性病变通常泛指肿瘤（良性的、恶性的）、寄生虫等，而不涉及疾病的病因。
          人和高等动物的呼吸器官。人的肺在胸腔内,左右各一,和支气管相连。
        </Row>
      </div>
    )


    bodyRef.current.testEnlarge(value);

    // changeInfoWindow();


  }




  const changeInfoWindow = (display: any, top: any, right: any) => {
    const testAnt = document.getElementById("testAnt");
    testAnt.style.display = display;
    testAnt.style.top = top;
    testAnt.style.right = right;
  }

  const closeInfoWindow = () => {
    bodyRef.current.testClose();
    changeInfoWindow("none", 100, 100);
  }


  useEffect(() => {

    setBodyModel(<BodyModel onRef={bodyRef} orgaDescription={orgaDescription} currentOrga={currentOrga}
                            illtypelist={illTypeList}>


    </BodyModel>)
  }, [])


  useEffect(()=>{
    GetAllBodyHealth();
  },[])


  const GetAllBodyHealth=()=>{
    if (dispatch){
      const params={
        personalHealthInfoParams:{
          user_id:"2017014713"
        },
        personalScoreHistoryParams:{
          user_id:"2017014713"
        },
      }
      dispatch({
        type:"bodyModel/getAllPersonalHealthInformation",
        payload:{
          params,
        }
      })
    }
  }


  return (
    <div className={styles.mainContainer}>
      {bodyModel}


    </div>
  )
}

// export default NormalProject;

export default connect(({bodyModel}) => ({
  bodyModelInfo: bodyModel,
}))(NormalProject);
