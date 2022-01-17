/**

 * @author MikyMei

 * @date 2021-11-22 15:14

 */


import React, {useEffect, useState, useRef} from 'react';
import styles from './index.less'
import BodyModel from "@/pages/ExtraModelCom/Components/BodyMOdel";
import {Avatar, Badge, Carousel, Col, Divider, Row, Tag, Tooltip, Spin, Select, Empty} from "antd";
import {AntDesignOutlined, CloseCircleOutlined} from "@ant-design/icons";
import {connect, Dispatch} from "umi";
import {MatchOrga} from "@/utils/dataReStructure";
import WholeBodyOrga from "@/pages/ExtraModelCom/Components/WholeBodyOrga";
import MixLineCharts from "@/pages/ExtraModelCom/Components/MixLineCharts";

const {Option} = Select;

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
    abnormalOrgaTop4Detail,
    loadStatus
  } = bodyModelInfo;


  const bodyRef = useRef(null);
  const [currentOrga, setCurrentOrga] = useState<any>('');
  const [orgaDescription, setOrgaDescription] = useState<any>('');
  const [illTypeList, setIlltypelist] = useState<any>([]);
  const [bodyModel, setBodyModel] = useState<any>();
  const [choosenPart, setChoosenPart] = useState<any>(); // 当前选中的身体部位， 默认直接选中第一个，没有的话，就渲染一个无异常部位
  const [partOptions, setPartOptions] = useState<any>(); // 将身体的所有异常部位渲染成一个options数组，
  const [orgaOptions, setOrgaOptions] = useState<any>(); // 以身体的部位为key值，value为器官卡片的数组，在数据请求完成后，一次渲染
  const [optionsCard, setOptionsCard] = useState<any>([]); // 主要用于存储已经被高亮的器官卡片样式，当进行其他操作的时候，再恢复，如：关闭器官的信息窗口，点击其他身体部位，选择其他器官卡片

  const [visible, setVisible] = useState<any>(false)
  const [modalTitle, setModalTitle] = useState<any>('') ;

  const enlargeItem = (value: any) => {
    bodyRef.current.testEnlarge(value);
  }


  const closeInfoWindow = () => {
    if (optionsCard.length > 0&&choosenPart!="全身性器官") {
      bodyRef.current.testClose();

    }
  }

  useEffect(() => {
    /**
     * 在这里进行加载地时候，加入一个修改全局加载地状态，loading
     *
     * */

    if (dispatch) {
      dispatch({
        type: "bodyModel/changeLoadStatus",
        payload: {
          newLoadStatus: true
        }
      })
    }

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
    if (JSON.stringify(allOrgaList) != "{}" && !partOptions) {
      GenerateOrgaRelated()
    }

  }, [abnormalOrgaTop4]);

  const OpenWholeOrga = (e: any, iconName: any, orgaName:any) => {
    e.currentTarget.style.boxShadow = '0px 0px 10px #d2a845 inset';
    /**
     * 要改变的项目是当前选中的，框的阴影图， 名字字体颜色，成绩字体颜色高亮, 在关闭信息窗的时候恢复，和点击其他的时候恢复
     * */
    e.currentTarget.children[0].children[0].children[0].children[0].src = `./img/allOrgaIcon/yellowOne/${iconName}.png`;
    e.currentTarget.children[0].children[1].children[0].style.color = "#d2a845";
    // e.currentTarget.children[0].children[2].style.color = "#d2a845";
    e.currentTarget.children[0].children[2].style.opacity = 1;
    e.currentTarget.children[0].children[2].style.textShadow = "0 0 10px currentColor";

    optionsCard.push(e.currentTarget);
    RestoreStyle();

    //  在这里请求全身性器官的具体病症

    GetWholeOrgaDetail(orgaName);
  }

  const GetWholeOrgaDetail=(orgaName:any)=>{
    if (dispatch){
      console.log("进入");

      dispatch({
        type:"bodyModel/getWholeOrgaIllDetail",
        payload:{
          params:{
            orgaName
          }
        }
      })
    }

    setModalTitle(`${orgaName}异常标识`);
    setVisible(true);
  }
  const CloseOrgaModal=()=>{
    setVisible(false);
  }


  const ScoreColor = (score: any) => {

    if (score>80){
      return {color:"#FF9C00"}
    }if (score>60){
      return {color:"#00FFDE"}
    }else{
      return {color:"#e21313"}
    }


  }

  /**
   * 渲染器官和申生成器官的卡片
   * */
  const GenerateOrgaRelated = () => {

    const partList = Object.keys(allOrgaList);
    const partOptionsTemp: any[] = [];
    if (partList.length > 0) {
      partList.map(item => {
        partOptionsTemp.push(
          <Option key={item} value={item}>{item}</Option>
        )
      })
    } else {
      partOptionsTemp.push(
        <Option key={"暂无异常部位"} value={"暂无异常部位"}>暂无异常部位</Option>
      )
    }

    setPartOptions(partOptionsTemp);
    partList[0] ? setChoosenPart(partList[0]) : null;

    /**
     * 在这里生成具体的器官带点击功能的卡片
     * */
    const orgaCardList: any = {};

    if (partList.length > 0) {
      for (let key in allOrgaList) {
        orgaCardList[`${key}`] = [];
        allOrgaList[`${key}`].map((item: any) => {
          const orgaRelated = MatchOrga(item.name)
          orgaCardList[`${key}`].push(
            <div key={item.name} className={styles.signleOption_unchecked}
                 onClick={(e) => {
                   key != "全身性器官" ? ClickSignleOrga(e, item.name, orgaRelated.meshName, orgaRelated.iconName) : OpenWholeOrga(e, orgaRelated.iconName, item.name)
                 }}>
              <Row gutter={24} className={styles.optionContent}>
                <Col className={styles.optionIcon}>
                  <Badge className={styles.badgeIcon} count={item.exceptionCount || 0} size="small" offset={[-6, 6]}
                         color={"#ff9c01"}>
                    <img className={styles.optionIconImg}
                         src={`./img/allOrgaIcon/greenOne/${orgaRelated.iconName}.png`}/>
                  </Badge>

                </Col>
                <Col className={styles.optionDesc}>
                  <Row className={styles.optionName}>{item.name || ''}</Row>
                  <Row className={styles.indexCount}><span
                    className={styles.yellowText}>{item.exceptionCount || 0}</span>&nbsp;种异常标识</Row>
                </Col>
                <Col className={styles.optionScore}
                     style={ScoreColor(item.score||0)}
                >
                  {item.score || 0}
                </Col>
              </Row>
            </div>
          )

        })
      }
    }
    setOrgaOptions(orgaCardList);

  }

  /**
   * 判断当前是否有已经被选中的器官卡片，如果有就恢复
   * */

  const RestoreStyle = () => {
    if (optionsCard.length > 1) {
      optionsCard[0].children[0].children[0].children[0].children[0].src = optionsCard[0].children[0].children[0].children[0].children[0].src.replace(/yellowOne/, "greenOne");

      optionsCard[0].style.boxShadow = '0 0 0px #ffffff';
      optionsCard[0].children[0].children[1].children[0].style.color = "#fcfcfc";
      optionsCard[0].children[0].children[1].children[0].style.opacity = 0.8;
      // optionsCard[0].children[0].children[2].style.color = "#00FFDE";
      optionsCard[0].children[0].children[2].style.opacity = 0.7;
      optionsCard[0].children[0].children[2].style.textShadow = "0 0 0px #ffffff";
      optionsCard.splice(0, 1);
    }
  }


  /**
   * 点击器官卡片进行的操作：改变卡片的样式，打开指定模型（改变模型位置，请求器官的数据）
   * */
  const ClickSignleOrga = (e: any, orgaName: any, meshName: any, iconName: any) => {
    // RestoreStyle();
    e.currentTarget.style.boxShadow = '0px 0px 10px #d2a845 inset';
    /**
     * 要改变的项目是当前选中的，框的阴影图， 名字字体颜色，成绩字体颜色高亮, 在关闭信息窗的时候恢复，和点击其他的时候恢复
     * */
    e.currentTarget.children[0].children[0].children[0].children[0].src = `./img/allOrgaIcon/yellowOne/${iconName}.png`;
    e.currentTarget.children[0].children[1].children[0].style.color = "#d2a845";
    // e.currentTarget.children[0].children[2].style.color = "#d2a845";
    e.currentTarget.children[0].children[2].style.opacity = 1;
    e.currentTarget.children[0].children[2].style.textShadow = "0 0 10px currentColor";

    optionsCard.push(e.currentTarget);
    RestoreStyle();
    enlargeItem(meshName);
  }


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
    <Spin spinning={false} size="large">
      <div className={styles.mainContainer}>
        {bodyModel}
        <div className={styles.siderColoumn}>
          <div className={styles.userCard}>
            <Col className={styles.avaterIcon}>
              <Avatar size={64} className={styles.avaterContent}>{personalInfo.name || ''}</Avatar>
            </Col>
            <Col className={styles.infoDetail}>
              <Row gutter={24} className={styles.topRow}>
                <Col span={4} className={styles.genderIcon}>
                  {
                    (personalInfo.gender && ["男", "man", "male"].includes(personalInfo.gender)) ?
                      <img className={styles.genderIcon} src={"./img/gendleMale.png"}/> :
                      <img className={styles.genderIcon} src={"./img/groupMan.png"}/>
                  }
                </Col>
                <Col span={18} className={styles.checkTime}>
                  {personalInfo.last_check_time || ''}
                </Col>
              </Row>
              <Row className={styles.bottomRow}>
                <Col className={styles.personHeight}>
                  <Tag className={styles.countTag}>{personalInfo.height || 188}&nbsp;cm</Tag>
                  <Tag className={styles.countTag}>{personalInfo.weight || 77}&nbsp;kg</Tag>
                </Col>
                <Col className={styles.personWeight}></Col>
              </Row>
            </Col>

          </div>
          <div className={styles.orgaList}>
            <div className={styles.partName}>
              <Select className={styles.partSelect}
                      key={choosenPart}
                      defaultValue={choosenPart}
                      autoFocus={true}
                      bordered={false}
                      onChange={(value: any) => {
                        closeInfoWindow();
                        setChoosenPart(value);
                      }}
                      dropdownClassName={styles.dropdownClassName}
              >
                {partOptions}
              </Select>
            </div>
            <div className={styles.orgaOptions}>
              {choosenPart ? orgaOptions[`${choosenPart}`] : <Empty/>}

            </div>


          </div>

        </div>
        <div className={styles.rightColumn}>
          <div className={styles.rightTop}>
            <div className={styles.topTitle}>基本健康信息</div>
            <div className={styles.topCharts}>
              <div className={styles.healthScore}>
                <div className={styles.scoreNumber}>{(personalHealthScore||0).toFixed(1)}</div>
                <div className={styles.scoreDesc}>健康得分</div>
              </div>
              <div className={styles.healthCharts}>

                <MixLineCharts lineData={{Xdata: ["2020","2021","2022","2023","2024"], data:[50,20,30,40,100], data2:[10,30,40,90,20]}}/>
              </div>
            </div>
            <div className={styles.indexFour}></div>


          </div>
          <div className={styles.rightBottom}>
            <div className={styles.bottomTitle}>异常器官Top4</div>
            <div className={styles.bottomCharts}></div>
          </div>
        </div>
        <WholeBodyOrga
        visible={visible}
        onCancel={CloseOrgaModal}
        modalTitle={modalTitle}
        //   visible={true}
        //   onCancel={CloseOrgaModal}
        //   modalTitle={"全身性器官异常标识"}
        />


      </div>
    </Spin>
  )
}

// export default NormalProject;

export default connect(({bodyModel}) => ({
  bodyModelInfo: bodyModel,
}))(NormalProject);
