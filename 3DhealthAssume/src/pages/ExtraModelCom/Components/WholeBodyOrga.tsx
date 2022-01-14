/**

 * @author MikyMei

 * @date 2022-01-13 16:22

 */

import React, {useEffect, useState, useRef} from 'react';
import styles from './WholeBody.less';
import {Modal, Form, Button, Tabs, Divider} from "antd";
import {connect, Dispatch} from "umi";
import {CloseCircleOutlined} from "@ant-design/icons";
import DPlayer from 'dplayer';
import VideoPlayer from './VideoPlayer'

const {TabPane} = Tabs;

const WholeBodyOrga: React.FC = (props: any) => {


  const {visible, onCancel, modalTitle, bodyModelInfo, dispatch,} = props;
  const {wholeOrgaIll} = bodyModelInfo;

  const [indexContent, setIndexContent] = useState<any>([]);

  useEffect(() => {
    if (wholeOrgaIll.length > 0) {
      generateLiiList();
    }

  }, [wholeOrgaIll])

  // useEffect(()=>{
  //   if (setIndexContent.length > 0) {
  //     playAllVideo();
  //   }
  // },[setIndexContent])


  const illList= [
    {
      name: "白血病",
      videoUrl: "https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4",
      illDesc: "	白血病是一类造血干细胞恶性克隆性疾病。克隆性白血病细胞因为增殖失控、分化障碍、凋亡受阻等机制在骨髓和其他造血组织中大量增殖累积，并浸润其他非造血组织和器官，同时抑制正常造血功能。临床可见不同程度的贫血、出血、感染发热以及肝、脾、淋巴结肿大和骨骼疼痛。	"
    },
    {
      name: "系统性红斑狼疮",
      videoUrl: "https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4",
      illDesc: "	系统性红斑狼疮（SLE）是一种多发于青年女性的累及多脏器的自身免疫性炎症性结缔组织病，早期、轻型和不典型的病例日渐增多。	"
    },
    {
      name: "类风湿关节炎",
      videoUrl: "https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4",
      illDesc: "	类风湿关节炎（RA）是一种病因未明的慢性、以炎性滑膜炎为主的系统性疾病。其特征是手、足小关节的多关节、对称性、侵袭性关节炎症，经常伴有关节外器官受累及血清类风湿因子阳性，可以导致关节畸形及功能丧失。	"
    },
    {
      name: "混合性结缔组织病",
      videoUrl: "https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4",
      illDesc: "	1972年Sharp等首先提出一种同时或不同时具有系统性红斑狼疮（SLE）、多发性肌炎（PM）、硬皮病（SSc）、类风湿关节炎（RA）等疾病的混和表现，血中有高滴度效价的斑点型ANA和高滴度U1RNP抗体的疾病，命名为混合性结缔组织病（MCTD）。	"
    },
    {
      name: "贝赫切特综合征",
      videoUrl: "https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4",
      illDesc: "	贝赫切特综合征又称白塞病，是一种全身性免疫系统疾病，属于血管炎的一种。其可侵害人体多个器官，包括口腔、皮肤、关节肌肉、眼睛、血管、心脏、肺和神经系统等，主要表现为反复口腔和会阴部溃疡、皮疹、下肢结节红斑、眼部虹膜炎、食管溃疡、小肠或结肠溃疡及关节肿痛等。	"
    },

  ]



  const generateLiiList = () => {
    const tempList:any=[];


    wholeOrgaIll.map((item: any, index: any) => {
      tempList.push(
        <TabPane tab={item.name||''} key={item.name||''}>
          <div className={styles.videoDesc}>
            <div id={item.name} className={styles.videoContent}>

              <VideoPlayer videoUrl={item.videoUrl||''}/>

            </div>
            {/*<Divider className={styles.videoDivider}/>*/}
            <div className={styles.descContent}>
              <Tabs defaultActiveKey="1">
                <TabPane tab="介绍" key="1">
                  <div className={styles.tabContent}>
                    {item.illDesc||''}
                  </div>
                </TabPane>

              </Tabs>
            </div>
          </div>
        </TabPane>
      );


    })

    setIndexContent(tempList);

  }

  // 播放视频
  const playAllVideo=()=>{
    illList.map((item:any, index:any)=>{
      console.log(document.getElementById(`${index * 1000}`));
    })

    // const dp = new DPlayer({
    //   container: document.getElementById(illList[0].name),
    //   video: {
    //     url: illList[0].videoUrl,
    //   },
    // });
    // dp.play();


  }



  // 当打开

  // useEffect(() => {
  //   const dp = new DPlayer({
  //     container: document.getElementById('videoContent'),
  //     video: {
  //       url: 'https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4',
  //     },
  //   });
  //   dp.play()
  // }, [])


  return (
    <Modal
      className={styles.orgaModal}
      title={modalTitle}
      closeIcon={<CloseCircleOutlined className={styles.orgaModalIcon}/>}
      onCancel={onCancel}
      visible={visible}
      onOk={onCancel}
      footer={null}
    >


      <Tabs defaultActiveKey="1" tabPosition={"left"} className={styles.modalTabs}>
        {indexContent}

      </Tabs>
    </Modal>
  )
}


export default connect(({bodyModel}) => ({
  bodyModelInfo: bodyModel,
}))(WholeBodyOrga);
