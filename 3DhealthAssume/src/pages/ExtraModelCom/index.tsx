/**

 * @author MikyMei

 * @date 2021-11-22 15:14

 */


import React, {useEffect, useState, useRef} from 'react';
import styles from './index.less'
import BodyModel from "@/pages/ExtraModelCom/Components/BodyMOdel";
import {Avatar, Badge, Carousel, Col, Divider, Row, Tag, Tooltip, Spin, Select} from "antd";
import {AntDesignOutlined, CloseCircleOutlined} from "@ant-design/icons";
import {connect, Dispatch} from "umi";

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


  const enlargeItem = async (value: any) => {
    bodyRef.current.testEnlarge(value);

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

  /**
   * 渲染器官和申生成器官的卡片
   * */
  const GenerateOrgaRelated = () => {
    const partList = Object.keys(allOrgaList);
    const partOptionsTemp: any[] = [];
    partList.map(item => {
      partOptionsTemp.push(
        <Option key={item} value={item}>{item}</Option>
      )
    })
    setPartOptions(partOptionsTemp);
    partList[0] ? setChoosenPart(partList[0]) : null;



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
                      dropdownClassName={styles.dropdownClassName}
              >
                {partOptions}
              </Select>
            </div>
            <div className={styles.orgaOptions}>
              <div className={styles.signleOption}>
                79
              </div>
            </div>



          </div>

        </div>


      </div>
    </Spin>
  )
}

// export default NormalProject;

export default connect(({bodyModel}) => ({
  bodyModelInfo: bodyModel,
}))(NormalProject);
