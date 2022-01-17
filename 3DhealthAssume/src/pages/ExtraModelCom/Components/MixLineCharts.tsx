/**

 * @author MikyMei

 * @date 2022-01-17 15:49

 */
import React, { useRef, useEffect } from 'react';
import styles from './MixLineChart.less'



const MixLineChart: React.FC<any> = (props) => {

  const {lineData } = props;
  const inputEl = useRef(null);


  useEffect(() => {
    // eslint-disable-next-line global-require
    const echarts = require("echarts")
    // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(inputEl.current, 'macarons')

    let option;


    // eslint-disable-next-line prefer-const
    option = {
      grid:{
        x:40,
        y:20,
        x2:10,
        y2:20,

      },

      xAxis: {
        type: 'category',
        data: lineData.Xdata,
        boundaryGap: false,
        axisTick: {
          show: false,
        },


        axisLabel:{
          margin:8,
          fontSize: "14px",
          fontFamily: "PingFang_SC",
          fontWeight: 400,
          color: "#C0C4CC",
          opacity: 0.8,
          align:"right"
        },
        splitLine:{
          show:false,
        },
        lineStyle: {
          color:"rgb(243 243 245)",
        }


      },
      yAxis: {
        scale:true,
        type: 'value',
        axisLabel:{
          margin:12,
          fontSize: "14px",
          fontFamily: "PingFang_SC",
          fontWeight: 400,
          color: "#C0C4CC",
          opacity: 0.8,
        },
      },
      tooltip: {
        trigger: 'axis'
      },
      lineStyle:{
        color:'#0066FF'
      },
      series: [
        /**
         * 在这里采用双折线，两个的area颜色不同
         * */
        {
          // symbol: 'image://https://midsp-front-1253940515.cos.ap-shanghai.myqcloud.com/assets/3.svg',
          symbolSize: 0,
          data: lineData.data,
          type: 'line',
          smooth: true,
          itemStyle:{
            normal:{
              lineStyle:{
                width: 3
              }
            }
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#0066FF'
              },
              {
                offset: 1,
                color: '#a3c0ec'
              }
            ])
          },
        },
        {
          // symbol: 'image://https://midsp-front-1253940515.cos.ap-shanghai.myqcloud.com/assets/3.svg',
          symbolSize: 0,
          data: lineData.data2,
          type: 'line',
          smooth: true,
          itemStyle:{
            normal:{
              lineStyle:{
                width: 3
              }
            }
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#aaf30b'
              },
              {
                offset: 1,
                color: '#d4f3c6'
              }
            ])
          },
        }

      ]
    };
    option && myChart.setOption(option);
  })

  return (
    <div style={{ width: "100%", height: "100%", }}>
      <div className={styles.submain} ref={inputEl} style={{ width: "100%", height: "100%" }} />
    </div>
  )
}
export default MixLineChart
