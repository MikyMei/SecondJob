/**

 * @author MikyMei

 * @date 2022-01-13 16:22

 */

import React, {useEffect, useState, useRef} from 'react';
import styles from './WholeBody.less';
import {Modal, Form, Button, Tabs, Divider, Tooltip} from "antd";
import {connect, Dispatch} from "umi";
import {CloseCircleOutlined} from "@ant-design/icons";
import DPlayer from 'dplayer';
import VideoPlayer from './VideoPlayer'

const {TabPane} = Tabs;

const WholeBodyOrga: React.FC = (props: any) => {


  const {visible, onCancel, modalTitle, bodyModelInfo, dispatch,} = props;
  // const {wholeOrgaIll} = bodyModelInfo;
  const wholeOrgaIll= [
    {
      name: "白血病",
      videoUrl: "https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4",
      illDesc: "白血病是一类造血干细胞恶性克隆性疾病。克隆性白血病细胞因为增殖失控、分化障碍、凋亡受阻等机制在骨髓和其他造血组织中大量增殖累积，并浸润其他非造血组织和器官，同时抑制正常造血功能。临床可见不同程度的贫血、出血、感染发热以及肝、脾、淋巴结肿大和骨骼疼痛。"
    },
  ]


  const [indexContent, setIndexContent] = useState<any>([]);
  const [playerList, setPlayerList]=useState<any>([]);

  // useEffect(() => {
  //   if (wholeOrgaIll.length > 0) {
  //     generateLiiList();
  //   }
  //
  // }, [wholeOrgaIll])



  const CloseModalAndPlayer=()=>{
    onCancel();
    playerList.map(player=>{
      player.pause();
    })
  }


  /**
   * 切换选项卡时的内容，关闭其他的播放器
   * */
  const PausBeforePlayer=()=>{
    if (playerList){
      playerList.map(player=>{
        player.pause();
      })
    }
  }

  const generateLiiList = () => {
    const tempList:any=[];


    wholeOrgaIll.map((item: any, index: any) => {
      tempList.push(

          <div className={styles.videoDesc}>
            <div id={item.name} className={styles.videoContent}>

              <VideoPlayer playerList={playerList} videoUrl={item.videoUrl||''}/>

            </div>
            {/*<Divider className={styles.videoDivider}/>*/}
          </div>
      );


    })

    setIndexContent(tempList);

  }








  return (
    <Modal
      className={styles.orgaModal}
      title={modalTitle}
      closeIcon={<CloseCircleOutlined className={styles.orgaModalIcon}/>}
      onCancel={CloseModalAndPlayer}
      visible={visible}
      onOk={onCancel}
      footer={null}
    >


          <VideoPlayer playerList={playerList} videoUrl={wholeOrgaIll[0].videoUrl||''}/>


        {/*{indexContent}*/}
    </Modal>
  )
}


export default connect(({bodyModel}) => ({
  bodyModelInfo: bodyModel,
}))(WholeBodyOrga);
