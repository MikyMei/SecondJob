/**

 * @author MikyMei

 * @date 2021-11-22 15:14

 */


import React, {useEffect, useState, useImperativeHandle, useRef} from 'react';
import {connect, history, Dispatch} from "umi";
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import BmiModal from "@/pages/ExtraModelCom/Components/bmimodal";


import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

import {CSS2DObject, CSS2DRenderer} from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import {CSS3DObject, CSS3DRenderer} from 'three/examples/jsm/renderers/CSS3DRenderer.js';


import styles from './index.less';
import {Avatar, Badge, Button, Slider, Tooltip, Row, Spin, Col, Divider, Tag, Carousel, Tabs, Image, Form} from "antd";
import Utils from "@/pages/ExtraModelCom/utils";
import * as TWEEN from '@tweenjs/tween.js';
import {AntDesignOutlined, CloseCircleOutlined, LoadingOutlined, UserOutlined} from "@ant-design/icons";
import {CarouselRef} from 'antd/lib/carousel';
import {JudgeExisted, JudgeGender, MatchIndexAnimaton} from "@/utils/dataReStructure";


const BodyModel: React.FC = (props: { onRef: any, currentOrga: any, orgaDescription: any, illTypeList: any, dispatch: Dispatch, bodyModelInfo: any }) => {


  const {TabPane} = Tabs;
  const {onRef, currentOrga, orgaDescription, illTypeList, dispatch, bodyModelInfo} = props;


  const {illList, selectedOrga, personalInfo} = bodyModelInfo;
  const loader = new GLTFLoader();


  /**
   *beIntersectObjects是用来存放需要射线检测的物体数组。
   *transformControl可以方便调节物体位置大小。
   * */
  let scene: any;
  const objects: any = [];
  const scanMeshModel: any = [];
  const standardObjects: any = [];
  const thinnerObjects: any = []; // 存放对比模型中的mesh目前只存放两个，皮肤和骨骼
  const lighterObjects: any = []; // 存放对比模型中的mesh目前只存放两个，皮肤和骨骼
  let camera: any;
  let plane: any;
  let spotLight: any;
  let ambient: any;
  let point: any;


  let renderer: any;
  let labelRenderer: any;

  let controls: any;
  let mainCanvas: any;
  let BodyShader: any;
  const time = {
    value: 0
  };
  const StartTime = {
    value: 0
  };
  let isStart = false;

  const clock = new THREE.Clock();
  let addTimer = true;
  let publicOpacity: 0;


  /**
   * 在这里存储可以使用滑块控制的，在忽快中展示的文本，以及对应数值调整地对应模型的名字（后期可以使用className进而控制一类地mesh）
   * 这个需要先确定有哪几类，在确定每一类中的所包含的器官名字，
   * */
  const matchType = ["皮肤", "骨骼", "内脏1", "内脏2", "内脏3", "内脏4", ""];

  const orgaTypeList = [["Retopo_皮肤", "皮肤", "超重", "全身_1", "胖"],
    ["Retopo_跟骨",
      "Retopo_腕骨",
      "Retopo_颈椎",
      "Retopo_锁骨",
      "Retopo_颅骨",
      "Retopo_牙齿_上",
      "Retopo_股骨",
      "Retopo_腓骨",
      "Retopo_肱骨",
      "Retopo_踝关节",
      "Retopo_下颌骨",
      "Retopo_牙齿_下",
      "Retopo_手",
      "Retopo_脚",
      "Retopo_骨盆",
      "Retopo_桡骨",
      "Retopo_肋骨",
      "Retopo_骶骨",
      "Retopo_肩胛骨",
      "Retopo_胸骨",
      "Retopo_跗骨",
      "Retopo_胫骨",
      "Retopo_尺骨",
      "Retopo_脊柱",
      //  以下为对比模型的名字
      "腰椎关节，腰椎",
      "肩关节",
      "手肘",
      "手腕",
      "手指",
      "牙，口",
      "头颈部，颅盖",
      "面部关节，头颈部",
      "颈椎",
      "骨盆，髋部",
      "骨盆，骶骨，髋部",
      "股骨，髋部，膝关节",
      "膝关节",
      "足关节",
      "胸椎",


    ],
    [
      "Retopo_大脑",
      "Retopo_小肠",
      "Retopo_肝脏",
      "咽",
      "喉和会厌",

      "血_脑屏障，中枢神经系统，脑",
      "小肠，肠黏膜",
      "肝脏",
      "鼻，头颈部",
      "耳",
      "口，舌",
      "面部肌肉，头颈部",
      "血_胸腺屏障",
      "血_眼屏障，眼"


    ],
    ["Retopo_生殖系统",
      "Retopo_肺",
      "Retopo_肾脏",

      "肺脏，血_气屏障",
      "肾脏，血_尿屏障",
      "肛",
      "睾丸，血_睾屏障",
      "睾丸，血_睾屏障，附睾",
      "尿道",
      "前列腺",
      "输精管，射精管",
      "输尿管",
      "骨盆肌",
      "肘肌，手肘",
      "肩肌，肩关节",
      "颈肌，颈椎",
      "髋肌，髋部",
      "膝肌，膝关节",
      "腰肌，腰椎",


    ],
    [
      "Retopo_胃部",
      "Retopo_消化系统",
      "Heart__Ani",
      "Retopo_心脏",
      "心脏",
      "心脏_",

      "胃",
      "胃_面片",
      "面片_胃_胃炎",
      "面片_胃_胃癌",
      "面片_胃_胃溃疡",
      "膀胱",
      "大肠",

    ],
    ["Retopo_静脉",
      "Retopo_动脉",
      "Retopo_支气管",
      "血管",
      "气管",
      "支气管",
      "食管",
      "中枢神经系统",
      "周围神经系统"

    ],
    []
  ];  // 根据器官将他们分为不同的部分，首先要知道他有几类

  const orgaMatchColor = {
    "Retopo_生殖系统": "#fcafaf",
    "Retopo_静脉": "#b8c7bf",
    "Retopo_动脉": "#fb7f68",
    "Retopo_大脑": "#D6C0AD",
    "Retopo_消化系统": "#EDBDA9",
    "Retopo_小肠": "#ffe196",
    "Retopo_胃部": "#ff9265",
    "Retopo_肝脏": "#ee934c",
    "Retopo_支气管": "#cc594b",
    "Retopo_肺": "#CB8F81",
    "Retopo_肾脏": "#F0834D",
    "Retopo_心脏": "#BC4D2A",

    "心脏": "#BC4D2A",
    "心脏_": "#BC4D2A",
    "气管": "#cc594b",
    "支气管": "#cc594b",

    "血_脑屏障，中枢神经系统，脑": "#D6C0AD",
    "胃": "#EDBDA9",
    "胃_面片": "#d7947b",
    "肝脏": "#ee934c",
    "肾脏，血_尿屏障": "#F0834D",
    "小肠，肠黏膜": "#F7D46C",
    "血管": "#fb7f68",
    "肺脏，血_气屏障": "#ff7464",
    "膀胱": "#ee934c",
    "鼻，头颈部": "#ffe196",
    "大肠": "#ff9265",
    "耳": "#fcd1ce",
    "肛": "#fcd1ce",
    "睾丸，血_睾屏障": "#ac7878",
    "睾丸，血_睾屏障，附睾": "#ac7878",
    "骨盆肌": "#CB8F81",
    "喉和会厌": "#ff8080",
    "肩肌，肩关节": "#CB8F81",
    "颈肌，颈椎": "#CB8F81",
    "口，舌": "#ff8080",
    "髋肌，髋部": "#CB8F81",
    "面部肌肉，头颈部": "#CB8F81",
    "尿道": "#ff9265",
    "前列腺": "#ee934c",
    "食管": "#b8c7bf",
    "输精管，射精管": "#fcafaf",
    "输尿管": "#fcafaf",
    "膝肌，膝关节": "#CB8F81",
    "血_胸腺屏障": "#ffe8e8",
    "血_眼屏障，眼": "#d2c5c5",
    "咽": "#fca5a5",
    "腰肌，腰椎": "#CB8F81",
    "中枢神经系统": "#f8ea97",
    "周围神经系统": "#ff2da3",
    "肘肌，手肘": "#CB8F81",

  };

  let choosenMesh: any;
  const loadIcon = <LoadingOutlined style={{fontSize: 24}} spin/>;

  const [infoTitle, setInfoTitle] = useState<any>('');
  const [infoDesc, setInfoDesc] = useState<any>('');
  const [contentList, setContentList] = useState<any>([]);
  const [orgaPicture, setOrgaPicture] = useState<any>([]);
  const [threeScence, setThreeScene] = useState<any>();
  const [threeCamera, setThreeCamera] = useState<any>();
  const [threeControls, setThreeControls] = useState<any>();
  const [threeRenderer, setThreeRenderer] = useState<any>();
  const [threeLabelRenderer, setThreeLabelRenderer] = useState<any>();
  const [threeObjects, setThreeObjects] = useState<any>();
  const [threeStandardObjects, setThreeStandardObjects] = useState<any>();  // 主要用来存放对比模型的所有器官的网格模型（目前存放的是超重模型）
  const [threeThinnerObjects, setThreeThinnerObjects] = useState<any>();  // 主要用来存放对比模型的所有器官的网格模型（目前存放的是超重模型）
  const [threeLighterObjects, setThreeLighterObjects] = useState<any>();  // 主要用来存放对比模型的所有器官的网格模型（目前存放的是较瘦模型）
  const [threeMainCanvas, setThreeMainCanvas] = useState<any>();
  const [threeAddTimer, setThreeAddTimer] = useState<any>(false);
  const [threeIsStart, setThreeIsStart] = useState<any>(false);
  const [threeTime, setThreeTime] = useState<any>({
    value: 0
  });
  const [threeStartTime, setThreeStartTime] = useState<any>({
    value: 0
  });

  const [nowOrgaMeshes, setNowOrgaMeshes] = useState<any>();// 主要用来存放当前宣红模型的时候，模型和片面的数组
  const [threeChoosenMesh, setThreeChoosenMesh] = useState<any>(null);

  const [displayType, setDisplayType] = useState<any>("none");
  const [currentInfoWindow, setCurrentInfoWindow] = useState<any>(); // 在选定器官的时候打开指定的信息窗口，
  const [controlMaterial, setControlMaterial] = useState<any>(null); // 保存起初就是不展示的器官，在点击之后再显示
  const [mixerAnimation, setMixerAnimation] = useState<any>(null); // 控制动画的
  const [animationList, setAnimationList] = useState<any>(); // 存放动画的数据组

  const [infoSelectedTab, setInfoSelectedTab] = useState<any>("0"); // 信息窗口选中的选项，主要是为了区分是否是异常标识
  const [playedAnimationed, setPlayedAnimationed] = useState<any>(null); //已经再被播放的动画、
  const [selectedAbnormal, setSelectedAbnormal] = useState<any>(null);  // 当前选中的异常标识
  // 主要用于模型对比功能，一般事先加载两个模型。一个正常模型。
  // 另一个是当前用户的的模型，如果需要对对比模型（即正常模型，进行操作，需要将状态变量中的受控模型进行重新赋值)
  const [meshCompare, setMeshCompare] = useState<boolean>(true);
  const [scanMesh, setScanMesh] = useState<any>();
  const [sliderValue, setSliderValue] = useState<any>(0);
  const [sliderFlag, setSliderFlag] = useState<any>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [nowBmi, setNowBmi] = useState<any>(21);
  const [modalForm] = Form.useForm();
  const [stomacheObject, setStomacheObject] = useState<any>();


  const textureLoader = new THREE.TextureLoader();
  let sliderDivIndex: CarouselRef | null = null;

  const carRef = useRef(null);

  const initModel = (modelType: any, modelName: any) => {


    // 获得渲染器长度
    mainCanvas = document.getElementById("webgl-output");


    /**
     * 结束
     * */


    scene = new THREE.Scene();
    /**
     *  只是将图片作为北京图片贴了上去，并没有实现3d效果，尤其是在进行旋转的时候感觉尤为明显,
     *  设置背景透明，仅仅使用父级html元素的背景图片作为背景
     *  */
    // scene.background = textureLoader.load('./img/sceneBackground.png');
    scene.background = null;


    // 获得渲染器所在的标签元素，作为渲染器的尺寸
    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setClearAlpha(0);
    renderer.outputEncoding = THREE.sRGBEncoding;
    // renderer.setClearColor(new THREE.Color("#eeeeee"));
    renderer.setSize(mainCanvas.offsetWidth * 0.8, mainCanvas.offsetHeight);
    renderer.shadowMap.enabled = true;


    /**
     * 在这里啊加入一个2d的图片到场景中，该2D图片作为人体模型底部的转盘，
     * 不在模型引入的时候加入是因为，模型会变
     * */
    const circleGeometry = new THREE.CircleGeometry(4, 1000);
    const circleMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.8,
      // backgroundColor: "#ffffff",
      // color: "#000000",

      side: THREE.DoubleSide,
      map: textureLoader.load('./img/downCircle3.svg')
    });
    const circle = new THREE.Mesh(circleGeometry, circleMaterial);
    circle.rotateX(-Math.PI / 2);
    circle.position.set(0, -4.5, 0);
    scene.add(circle);


    // 2d渲染器
    labelRenderer = new CSS2DRenderer();  // 新增的渲染器
    labelRenderer.setSize(mainCanvas.offsetWidth * 0.8, mainCanvas.offsetHeight);
    // this.labelRenderer.domElement.style.position = 'absolute';
    // this.labelRenderer.domElement.style.top = 0;
    labelRenderer.domElement.style = "pointer-events: auto;position: absolute;top: 0px;"  // 处理新的渲染器


    // 创建聚光灯
    spotLight = new THREE.SpotLight(0xFFFFFF);
    spotLight.position.set(30, 30, 30);
    spotLight.castShadow = true;
    spotLight.angle = Math.PI / 10;
    spotLight.shadow.penumbra = 0.05;
    spotLight.shadow.mapSize.width = 3026;
    spotLight.shadow.mapSize.height = 3026;
    // scene.add(spotLight);

    ambient = new THREE.AmbientLight(0x444444);
    scene.add(ambient);

    /**
     * 前后两个点光源
     * */
    point = new THREE.PointLight(0xffffff);
    point.position.set(0, 200, 300); // 点光源位置
    scene.add(point);
    //
    const backPoint = new THREE.PointLight(0xffffff);
    backPoint.position.set(0, 200, -300); // 点光源位置
    scene.add(backPoint);


    camera = new THREE.PerspectiveCamera(45, mainCanvas.offsetWidth * 0.8 / mainCanvas.offsetHeight, 0.1, 2000);

    // 定位相机，并且指向场景中心
    camera.position.x = 0;
    camera.position.y = 2;
    camera.position.z = 15;
    camera.lookAt(0, 0, 0);


    /**
     * 加载当前用户的模型，后面还要加载一个正常模型（所有网格模型都是正常形态，事先让其所有的模型都可见性为false）
     * */
    let model;
    loader.load(`./img/allKindsOfModel/${modelType}/standardFigure4.gltf`, function (gltf: any) {
        model = gltf.scene;
        model.scale.setScalar(5.5, 5.5, 5.5);
        model.position.setY(-4.5);
        model.visible = meshCompare;

        /**
         * beIntersectObjects是用来存放需要射线检测的物体数组。
         * transformControl可以方便调节物体位置大小。
         * */

        /**
         * 在这里将模型地动画全部格式化，并生成mixer
         * */
        const mixer = new THREE.AnimationMixer(model);
        // const action = mixer.clipAction(gltf.animations[0]);
        // action.play();

        setMixerAnimation(mixer);
        let tempAnimationList: any = new Object();
        if (gltf.animations && gltf.animations.length > 0) {
          gltf.animations.map((item: any, index: any) => {
            if (item.tracks[0] && item.tracks[0].name) {
              /**
               * 这里只是根据动画的名字，而将该动画划分到合适的器官下，获得地名字可以改变
               * 如果模型变了，那么动画的state变量也要彻底改变
               * */
              let orgaName = item.tracks[0].name.split(".")[0];
              const animationName = item.tracks[0].name.split(".")[1];
              if (orgaName === "Retopo_心脏_") {
                orgaName = "Retopo_心脏"
              }
              tempAnimationList[`${orgaName}`] = [];
              tempAnimationList[`${orgaName}`].push(
                {
                  indexName: animationName,
                  animationContent: mixer.clipAction(gltf.animations[index])
                }
              )
              mixer.clipAction(gltf.animations[index]).play();
            }
          })
        }

        setAnimationList(tempAnimationList);


        model.name = "userMeshModel";

        scene.add(model);
        model.traverse((child: any) => {
            /**
             * 在这里将不同模型根据他的名字，将
             * */


            if (child.name === "Retopo_心脏_") {
              child.name = "Retopo_心脏"
            }

            if (child.geometry) {
              child.geometry.computeBoundingBox();
              child.geometry.computeBoundingSphere()
            }
            /**
             * 遍历模型的时候，加一个参数，主要是为了在加载对比模型
             * */

            if (child.isMesh) {
              objects.push(child);
              processGLTFChild(child, false)

            }
          }
        );

      },
      undefined

      , function (error) {

        console.error(error);

      });


    /**
     * 加载标准的模型，但是里面的所有child的可见性设置为不可见，目前来看只加载皮肤和骨骼；
     * 定义一个对比模型需要加载的子模型的名字，例如只加载骨骼和皮肤
     * */
    let standardModel;
    const compareMeshList = [
      "腰椎关节，腰椎",
      "肩关节",
      "手肘",
      "手腕",
      "手指",
      "牙，口",
      "头颈部，颅盖",
      "面部关节，头颈部",
      "颈椎",
      "骨盆，髋部",
      "骨盆，骶骨，髋部",
      "股骨，髋部，膝关节",
      "膝关节",
      "足关节",
      "胸椎",
      "全身_1",
      "胖",
    ]

    loader.load(`./img/allKindsOfModel/${modelType}/overWeightFigure2.gltf`, function (gltf: any) {
        standardModel = gltf.scene;
        standardModel.scale.setScalar(5.5, 5.5, 5.5);
        standardModel.position.setY(-4.5);
        standardModel.visible = meshCompare;

        /**
         * beIntersectObjects是用来存放需要射线检测的物体数组。
         * transformControl可以方便调节物体位置大小。
         * */

        /**
         * 在这里将模型地动画全部格式化，并生成mixer
         * */


        standardModel.name = "standardModel";

        scene.add(standardModel);
        standardModel.traverse((child: any) => {
            /**
             * 在这里将不同模型根据他的名字，将
             * */


            /**
             * 遍历模型的时候，加一个参数，主要是为了在加载对比模型
             * */

            if (child.isMesh) {

              child.visible = false;
              if (compareMeshList.includes(child.name)) {
                standardObjects.push(child);
                processGLTFChild(child, true);
              }


            }
          }
        );

      },
      undefined

      , function (error) {

        console.error(error);

      });

    /**
     * 加载比肥胖的模型，一般来说只加载皮肤和谷歌模型
     * */


    controls = new OrbitControls(camera, renderer.domElement);
    // controls.mouseButtons = {
    //   LEFT: THREE.MOUSE.ROTATE,
    //   MIDDLE: THREE.MOUSE.DOLLY,
    //   RIGHT: ''
    // }
    controls.enableDamping = true;


    setThreeScene(scene);
    setThreeCamera(camera);
    setThreeLabelRenderer(labelRenderer);
    setThreeRenderer(renderer);
    setThreeControls(controls);
    setThreeObjects(objects);
    setScanMesh(scanMeshModel);
    setThreeStandardObjects(standardObjects);
    setThreeThinnerObjects(thinnerObjects);
    setThreeLighterObjects(lighterObjects);
    setThreeMainCanvas(mainCanvas);
  }

  /**
   * 初始化只负责赋值，当赋值完成后在将他加进去
   * */
  useEffect(() => {
    if (threeCamera && threeControls && threeLabelRenderer && threeRenderer) {
      BuildScene();
    }

  }, [threeCamera, threeControls, threeLabelRenderer, threeRenderer])

  useEffect(() => {
    if (threeChoosenMesh) {
      render();
    }
  }, [threeChoosenMesh])

  const changeLoading = (value: any) => {
    if (dispatch) {
      dispatch({
        type: "bodyModel/changeLoadStatus",
        payload: {
          newLoadStatus: value
        }
      })
    }
  }

  const BuildScene = () => {
    window.document.getElementById('webgl-output').appendChild(threeRenderer.domElement);
    window.document.getElementById("webgl-output").appendChild(threeLabelRenderer.domElement);
    // generatePointsCircle();

    setTimeout(() => {
      setThreeIsStart(true);


    }, 200)


    setTimeout(() => {
      changeLoading(false);

    }, 1500)

    render();
    window.addEventListener('resize', onWindowResize);

    document.querySelector("#webgl-output");


  }


  const onWindowResize = () => {

    if (threeMainCanvas) {
      threeCamera.aspect = threeMainCanvas.offsetWidth * 0.8 / threeMainCanvas.offsetHeight;
      threeCamera.updateProjectionMatrix();

      threeRenderer.setSize(threeMainCanvas.offsetWidth * 0.8, threeMainCanvas.offsetHeight);
      // threeLabelRenderer.setSize(window.innerWidth, threeMainCanvas.offsetHeight);


    }

  }


  // @ts-ignore
  const render = () => {


    /**
     * 实现身体扫光
     * */
    const dt = clock.getDelta();
    /**
     * 模型的动画
     * */

    if (mixerAnimation) {
      mixerAnimation.update(dt);
    }


    if (dt > 1) return false;

    if (time.value >= 0.48 || addTimer === true) {
      time.value -= dt / 5;
      if (time.value <= 0.0) {
        addTimer = false
      }
    } else if (time.value <= 0.0 || addTimer === false) {
      time.value += dt / 5;
      if (time.value >= 0.48) {
        addTimer = true
      }
    }
    setThreeAddTimer(addTimer);
    setThreeTime(time);
    /**
     * 这里是固定了皮肤的在最后一个，实际上需要在最开始的时候就整出来
     * */
    if (scanMesh.length > 0) {
      scanMesh.map(item => {
        item.material.uniforms.time = time;
      })


    }


    if (isStart) {
      StartTime.value += dt * 0.6;
      if (StartTime.value >= 1) {
        StartTime.value = 1;
        isStart = false;
      }
    }
    setThreeIsStart(isStart);
    setThreeStartTime(StartTime);


    if (threeControls) {
      threeControls.update();

    }

    if (TWEEN) {
      TWEEN.update();
    }


    threeRenderer.render(threeScence, threeCamera);
    threeLabelRenderer.render(threeScence, threeCamera);


    requestAnimationFrame(render);


  }


  function Shaders(color: any) {
    const vertexShader = [
      'varying vec3	vVertexWorldPosition;',
      'varying vec3	vVertexNormal;',
      'varying vec4	vFragColor;',
      'void main(){',
      '	vVertexNormal	= normalize(normalMatrix * normal);',// 将法线转换到视图坐标系中
      '	vVertexWorldPosition	= (modelMatrix * vec4(position, 1)).xyz;',// 将顶点转换到世界坐标系中
      '	// set gl_Position',
      '	gl_Position	= projectionMatrix * modelViewMatrix * vec4(position, 1);',
      '}'

    ].join('\n');
    // 身体皮肤效果
    const AeroSphere = {
      uniforms: {
        coeficient: {
          type: "f",
          value: 1.0
        },
        power: {
          type: "f",
          value: 0.5
        },
        glowColor: {
          type: "c",
          value: new THREE.Color("#51AEF4")
          //  "#51AEF4"
        }
      },
      vertexShader,
      fragmentShader: [
        'uniform vec3	glowColor;',
        'uniform float	coeficient;',
        'uniform float	power;',

        'varying vec3	vVertexNormal;',
        'varying vec3	vVertexWorldPosition;',

        'varying vec4	vFragColor;',

        'void main(){',
        '	vec3 worldCameraToVertex= vVertexWorldPosition - cameraPosition;',	// 世界坐标系中从相机位置到顶点位置的距离
        '	vec3 viewCameraToVertex	= (viewMatrix * vec4(worldCameraToVertex, 0.0)).xyz;',// 视图坐标系中从相机位置到顶点位置的距离
        '	viewCameraToVertex	= normalize(viewCameraToVertex);',// 规一化
        '	float intensity		= pow(coeficient + dot(vVertexNormal, viewCameraToVertex), power);',
        '	gl_FragColor		= vec4(glowColor, intensity);',
        '}'

      ].join('\n')
    }
    const AeroSphere1 = {
      uniforms: {
        coeficient: {
          type: "f",
          value: 1
        },
        power: {
          type: "f",
          value: 1
        },
        glowColor: {
          type: "c",
          value: new THREE.Color(color)
          //  #30D2BD
        }
      },
      vertexShader,
      fragmentShader: [
        'uniform vec3	glowColor;',
        'uniform float	coeficient;',
        'uniform float	power;',

        'varying vec3	vVertexNormal;',
        'varying vec3	vVertexWorldPosition;',

        'varying vec4	vFragColor;',

        'void main(){',
        '	vec3 worldCameraToVertex= vVertexWorldPosition - cameraPosition;',	// 世界坐标系中从相机位置到顶点位置的距离
        '	vec3 viewCameraToVertex	= (viewMatrix * vec4(worldCameraToVertex, 0.0)).xyz;',// 视图坐标系中从相机位置到顶点位置的距离
        '	viewCameraToVertex	= normalize(viewCameraToVertex);',// 规一化
        '	float intensity		= pow(coeficient + dot(vVertexNormal, viewCameraToVertex), power);',
        '	gl_FragColor		= vec4(glowColor, intensity);',
        '}'// vVertexNormal视图坐标系中点的法向量
        // viewCameraToVertex视图坐标系中点到摄像机的距离向量
        // dot点乘得到它们的夹角的cos值
        // 从中心向外面角度越来越小（从钝角到锐角）从cos函数也可以知道这个值由负变正，不透明度最终从低到高
      ].join('\n')
    }
    const AeroSphere3 = {
      uniforms: {
        coeficient: {
          type: "f",
          value: 1
        },
        power: {
          type: "f",
          value: 0.2
        },
        glowColor: {
          type: "c",
          value: new THREE.Color(color)
        }
      },
      vertexShader,
      fragmentShader: [
        'uniform vec3	glowColor;',
        'uniform float	coeficient;',
        'uniform float	power;',

        'varying vec3	vVertexNormal;',
        'varying vec3	vVertexWorldPosition;',

        'varying vec4	vFragColor;',

        'void main(){',
        '	vec3 worldCameraToVertex= vVertexWorldPosition - cameraPosition;',	// 世界坐标系中从相机位置到顶点位置的距离
        '	vec3 viewCameraToVertex	= (viewMatrix * vec4(worldCameraToVertex, 0.0)).xyz;',// 视图坐标系中从相机位置到顶点位置的距离
        '	viewCameraToVertex	= normalize(viewCameraToVertex);',// 规一化
        '	float intensity		= pow(coeficient + dot(vVertexNormal, viewCameraToVertex), power);',
        '	gl_FragColor		= vec4(glowColor, intensity);',
        '}'// vVertexNormal视图坐标系中点的法向量
        // viewCameraToVertex视图坐标系中点到摄像机的距离向量
        // dot点乘得到它们的夹角的cos值
        // 从中心向外面角度越来越小（从钝角到锐角）从cos函数也可以知道这个值由负变正，不透明度最终从低到高
      ].join('\n')
    }

    const material1 = new THREE.ShaderMaterial({
      uniforms: AeroSphere.uniforms,
      vertexShader: AeroSphere.vertexShader,
      fragmentShader: AeroSphere.fragmentShader,
      blending: THREE.NormalBlending,
      transparent: true,
      depthWrite: false,
      // morphTargets: true,

    });
    const material2 = new THREE.ShaderMaterial({
      uniforms: AeroSphere1.uniforms,
      vertexShader: AeroSphere1.vertexShader,
      fragmentShader: AeroSphere1.fragmentShader,
      blending: THREE.NormalBlending,
      transparent: true,
      depthWrite: false,
      visible: true,
      // morphTargets: true,

    });
    const material3 = new THREE.ShaderMaterial({
      uniforms: AeroSphere3.uniforms,
      vertexShader: AeroSphere3.vertexShader,
      fragmentShader: AeroSphere3.fragmentShader,
      blending: THREE.NormalBlending,
      transparent: true,
      depthWrite: false,
      visible: false,
      // morphTargets: true,

    });
    return {material1, material2, material3}
  }


  /**
   * 增加着色器
   * */

  /**
   * 给材质赋值颜色
   * */
  const setCityMaterial = (object: any) => {
    // 确定oject的geometry的box size
    object.geometry.computeBoundingBox();
    object.geometry.computeBoundingSphere();
    let materialBody: any;
    const {geometry} = object;

    // 获取geometry的长宽高 中心点
    const {center, radius} = geometry.boundingSphere;

    /**
     *
     * 把保卫模型的球弄出来
     * */


    /**
     *
     *
     * */

    const {max, min} = geometry.boundingBox;

    const size = new THREE.Vector3(
      max.x - min.x,
      max.y - min.y,
      max.z - min.z,
    );


    Utils.forMaterial(object.material, (material: any) => {
      material.transparent = true;

      material.color.setStyle('#ffffff');
      BodyShader = {
        uniforms: {
          time,
          uStartTime: threeStartTime,
          uCenter: {
            value: new THREE.Vector3(0, 0, 0),
          },
          uSize: {
            value: size,
          },
          uMax: {
            value: max,
          },
          uMin: {
            value: min,
          },
          uTopColor: {
            value: new THREE.Color('#30D2BD'),
          },
          uDiffusion: {
            value: new THREE.Vector3(
              1, // 0 1开关
              4, // 范围
              0.1, // 速度
            ),
          },

          uFlow: {
            value: new THREE.Vector3(
              1, // 0 1开关
              0.4, // 范围
              4 // 速度
            )
          },

          uFlowColor: {
            value: new THREE.Color("#ffffff")
          },

          uColor: {
            value: new THREE.Color('#fffa89'),
          },
          uOpacity: {
            value: 1,
          },
          uRadius: {
            value: radius / 10,
          },
          coeficient: {
            type: 'f',
            value: 1.0,
          },
          power: {
            type: 'f',
            value: 0.9,
          },
          glowColor: {
            type: 'c',
            value: new THREE.Color('#30D2BD'),
          },
          cameraMatrix: {
            value: new THREE.Matrix4(),
          },
        },
        vertexShader: `
          varying vec3	vVertexWorldPosition;
          uniform float time;
          varying vec3	vVertexNormal;
          varying vec4	vFragColor;
          varying vec4 vPositionMatrix;
          varying vec3 vPosition;
          uniform float uStartTime;
          void main() {
            vVertexNormal	= normalize(normalMatrix * normal);
            vVertexWorldPosition	= (modelMatrix * vec4(position, 1)).xyz;
            vPositionMatrix = projectionMatrix * vec4(position, 1.0);
            vPosition = position;
            gl_Position	= projectionMatrix * modelViewMatrix * vec4(position.x, position.y, position.z , 1);
          }`,
        fragmentShader: `
          float distanceTo(vec2 src, vec2 dst) {
            float dx = src.x - dst.x;
            float dy = src.y - dst.y;
            float dv = dx * dx + dy * dy;
            return sqrt(dv);
        }
          varying vec4 vPositionMatrix;
          varying vec3 vPosition;

          uniform float time;
          // 扩散参数
          uniform float uRadius;
          uniform float uOpacity;
          // 初始动画参数
          uniform float uStartTime;

          uniform vec3 uMin;
          uniform vec3 uMax;
          uniform vec3 uSize;
          uniform vec3 uColor;
          uniform vec3 uCenter;

          // 上下流动的参数
          uniform vec3 uFlow;
          uniform vec3 uFlowColor;



          uniform vec3	glowColor;
          uniform float	coeficient;
          uniform float	power;
          varying vec3	vVertexNormal;
          varying vec3	vVertexWorldPosition;
          varying vec4	vFragColor;

          uniform vec3 uTopColor;
          uniform vec3 uDiffusion;
          uniform vec3 uDiffusionCenter;
          void main() {
          vec3 distColor =  vec3(0.5, 1.0, 1.0);

          float indexMix = vPosition.z / uSize.z ;
          distColor = mix(distColor, uTopColor, indexMix);
          // 开启扩散波
          vec2 position2D = vec2(vPosition.x, vPosition.y);


            if (uFlow.x > 0.5) {
                // 扩散速度
                float dTime = mod(time * uFlow.z , uSize.y);
                // 流动范围
                float topY = vPosition.y + uFlow.y;
                if (dTime > vPosition.y && dTime < topY) {
                    // 颜色渐变
                    float dIndex = sin((topY - dTime) / uFlow.y *3.14);

                    distColor = mix(distColor, uFlowColor,  dIndex);
                }
            }
          vec3 worldCameraToVertex= vVertexWorldPosition - cameraPosition;
          vec3 viewCameraToVertex	= (viewMatrix * vec4(worldCameraToVertex, 0.0)).xyz;
          viewCameraToVertex	= normalize(viewCameraToVertex);
          float intensity	= pow(coeficient + dot(vVertexNormal, viewCameraToVertex),power);
          gl_FragColor	= vec4(distColor, 1) * intensity ;
          }`,
      };

      materialBody = new THREE.ShaderMaterial({
        uniforms: BodyShader.uniforms,
        vertexShader: BodyShader.vertexShader,
        fragmentShader: BodyShader.fragmentShader,
        blending: THREE.NormalBlending,
        transparent: true,
        depthWrite: false,
        visible: true,
      });
    });
    return {materialBody};
  };


  const JudgeOrgaType = (orgaName: any) => {
    let result = -1;
    orgaTypeList.map((item: any, index: any) => {
      if (item.indexOf(orgaName) != -1) {
        result = index;
      }

    })
    return result;
  }


  const processGLTFChild = (child: any, visible: boolean) => {

    try {
      // if (child.isMesh) {


      // 根据器官属于在哪个数组，判断属于哪一类，选择哪一类着色器材质
      const type = JudgeOrgaType(child.name);


      switch (type) {
        case 0:
          scanMeshModel.push(child);
          child.material = setCityMaterial(child).materialBody;

          child.castShadow = true;

          break;
        case 1:
          child.material = Shaders("#30D2BD").material2;
          child.castShadow = true;
          break;
        case 2:
        case 3:
        case 4:
        case 5:

          /**
           * 以下为两种方案，着色器的优势在于控制滑动隐藏上，而动画不能用
           * */


          // 目前先用这种判断，后续所有的器官都有了贴图就不用判断
          if (["胃", "胃_面片", "面片_胃_胃炎", "面片_胃_胃癌", "面片_胃_胃溃疡"].includes(child.name)) {
            // 在这里设置的透明度，两个有效，两个无效
            child.material.emissive = child.material.color;
            child.material.emissiveMap = child.material.map;
            child.material.visible = visible;
            child.material.transparent = true;
            // child.material.opacity = 0.5;
            child.material.emissive = child.material.color;
            child.material.side = THREE.DoubleSide;

            // child.material = new THREE.MeshStandardMaterial(
            //   {
            //     // color: orgaMatchColor[`${child.name}`],
            //     transparent: true,
            //     opacity: 0.9,
            //     visible: visible,
            //     metalness: 0,
            //     roughness: 0,
            //     specular: child.material.color,
            //     emissiveMap: child.material.map,
            //     emissive: child.material.color,
            //     lightMapIntensity: 1,
            //     envMapIntensity: 1,
            //
            //     shininess: 10,
            //
            //     side: THREE.DoubleSide,
            //     depthWrite: true
            //   });
          } else {
            child.material = new THREE.MeshPhongMaterial(
              {
                color: orgaMatchColor[`${child.name}`],
                transparent: true,
                opacity: 0.9,
                visible: visible,
                // metalness: 0,
                // roughness: 0,
                specular: "#ffffff",
                shininess: 2000,
                // envMapIntensity: 1,
                side: THREE.DoubleSide,
                depthWrite: true
              });
          }


          // child.material = Shaders(orgaMatchColor[`${child.name}`]).material3;
          child.castShadow = true

          break;
        default:
          child.material = Shaders("#30D2BD").material2;
          child.castShadow = true;
          break;
      }
      // }
    } catch (e) {
      console.log('error:', e)
      console.error('设置色彩出错, child:', child)
    }
  }


  useEffect(() => {
    /**
     * 在这里加个方法，来返回用户的模型，男女，和哪个
     * */

    if (personalInfo.name) {
      const result = JudgeGender(personalInfo);
      initModel(result.finalGender, result.finalModel);

    }

  }, [personalInfo])


  /**
   * 定制化tooltip地展示格式
   * */
  const formatter = (value: any) => {


    return ` ${value} ${matchType[Math.floor(value)]}`;
  }


  /**
   *
   * 更改选中的模型的透明度，或者是全部,最好在华东的时候展示最近控制的，
   * 采用两种滑块调节透明度，一种是在滑块改变完成之后进行调用，这样在食用地时候使用补间动画
   * 还有就是当模型滑块的值向下取整的时候大于下标的时候就直接设置为visiable不可见
   * */

  /**
   * 主要是当滑动条不是匀速的时候调用，用于将之前的都隐藏掉，之后的都可视，且透明度均为一
   * */

  const changeBeforeOpacity = (index: any) => {


    /**
     * 把index地剔除剩下的拿出来，挨个进行设置
     * */

    const oldObjects = orgaTypeList.slice(0);
    const beforeObjects = oldObjects.slice(0, index);
    const afterObjects = oldObjects.slice(index + 1, oldObjects.length - 1);


    /**
     *分别对前后进行不同的操作
     * 1，对前面的
     * 2，对后面的
     * */
    if (threeObjects.length > 0 && (beforeObjects.length > 0 || afterObjects.length)) {
      threeObjects.map((object: any) => {
        if (beforeObjects.toString().indexOf(object.name) !== -1) {
          object.material.visible = false;

        }

        if (afterObjects.toString().indexOf(object.name) !== -1) {

          object.material.visible = true;
          /**
           * 这个适用于着色器的修改透明度
           * */


          if (object.material.uniforms) {
            new TWEEN.Tween(object.material.uniforms.coeficient)
              .to({type: 'f', value: 1}, 500) // 在1s内移动至 (0, 0)
              .easing(TWEEN.Easing.Quadratic.InOut) // 使用缓动功能使的动画更加平滑
              .start()
          } else {
            new TWEEN.Tween(object.material)
              .to({opacity: 0.9}, 500) // 在1s内移动至 (0, 0)
              .easing(TWEEN.Easing.Quadratic.InOut) // 使用缓动功能使的动画更加平滑
              .start()
          }

        }

      })
    }


  }

  /**
   * restore all model material,
   * when you do or ready to interact with the model, and when "sliderValue is not zero"
   * */

  const ResetAllOpacity = () => {
    const oldObjects = orgaTypeList.slice(0);
    const displayObjects = orgaTypeList.slice(0, 2);
    const hidedenObjects = orgaTypeList.slice(2, oldObjects.length - 1);

    if (sliderFlag && oldObjects.length > 0) {
      threeObjects.map((object: any, index: any) => {

        if (JudgeExisted(hidedenObjects, object.name)) {
          object.material.visible = false;
        } else {

          if (object.material.uniforms) {

            object.material.visible = true;
            object.material.uniforms.coeficient = {type: 'f', value: 1}
          } else {

            object.material.visible = true;
            object.material.opacity = 0.9;
          }
        }

      })
      setSliderValue(0);
      setSliderFlag(false)
    }
  }


  const sliderChange = (value: any) => {
    setSliderValue(value);
    setSliderFlag(true);
    //  orgaTypeList
    // 获取当前需要被一起控制的一类mesh
    const nowMesh = orgaTypeList[Math.floor(value)];
    changeBeforeOpacity(Math.floor(value))
    publicOpacity = value;
    threeObjects.map((object: any, index: any) => {
      if (nowMesh.includes(object.name)) {

        const needOpacity = Math.abs(publicOpacity - Math.floor(value) > 1 ? 1.0 : 1.0 - (publicOpacity - Math.floor(value))).toFixed(1);


        if (needOpacity === "0.1") {

          object.material.visible = false;
        } else {
          object.material.visible = true;
        }


        /**
         * 这个适用于着色器的修改透明度， 一般的就直接修改材质里的透明度， 因为皮肤和骨骼使用的是着色器，所以修改透明度的方式不同
         * */
        if (object.material.uniforms) {
          new TWEEN.Tween(object.material.uniforms.coeficient)
            .to({type: 'f', value: needOpacity}, 500) // 在1s内移动至 (0, 0)
            .easing(TWEEN.Easing.Quadratic.InOut) // 使用缓动功能使的动画更加平滑
            .start()
        } else {
          new TWEEN.Tween(object.material)
            .to({opacity: needOpacity * 0.9}, 500) // 在1s内移动至 (0, 0)
            .easing(TWEEN.Easing.Quadratic.InOut) // 使用缓动功能使的动画更加平滑
            .start()
        }


      }
    })
  }


  /**
   * 一个公共的相机和场景中心移动补间动画的方法
   * 参数为需要拉近的模型，和位置计算用到的半径，
   * */

  const MoveTargetCamera = (mesh?: any, radius?: any) => {

    // 如果两个参数都有，就是拉近距离，否则就是回退到原始
    if (mesh && radius){
      const centroid = new THREE.Vector3(0, 0, 0);
      centroid.addVectors(mesh.geometry.boundingBox.min, mesh.geometry.boundingBox.max);
      centroid.multiplyScalar(0.5);
      centroid.applyMatrix4(mesh.matrixWorld);


      new TWEEN.Tween(threeCamera.position)
        .to({x: centroid.x, y: centroid.y * 1.0, z: centroid.z + radius * 13}, 3000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start();

      new TWEEN.Tween(threeControls.target)
        .to({x: centroid.x, y: centroid.y, z: centroid.z}, 1500)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start();
    }else{
      new TWEEN.Tween(threeCamera.position)
        .to({x: 0, y: 2, z: 15}, 1500)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start();
      new TWEEN.Tween(threeControls.target)
        .to({x: 0, y: 0, z: 0}, 1500)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start();
    }

  }

  /**
   * 在人体模型的右侧防止一个器官的栏目，点击具体的栏目会直接展开栏目的模型, 在加载玩模型的时候在重置一个,
   * 不能使用多场景，只能使用图标，对性能要求第一点
   * */


  /**
   * 点击放大或者是打开器官的弹框，或者跳到指定位置
   * */
  const enlargeItem = async (name: any) => {
    await RestoreCompare("null");


    if (controlMaterial) {
      controlMaterial.visible = false;
      setControlMaterial(null);
    }
    ;

    // 临时保存点击器官后控制展示的器官模型和对应的面片模型
    const meshList: any = [];


    await threeObjects.forEach((object: any, index: any) => {

        if (name.includes(object.name)) {
          meshList.push(object);

          const {radius, center} = object.geometry.boundingSphere;

          // 在这里对选中的器官模型进行分类处理，1:没有默认显示的模型（器官模型）,2:默认已经显示的模型（骨骼模型）
          if (!object.material.visible) {
            setControlMaterial(object.material);
            object.material.visible = true;
          } else {
            object.material.uniforms.glowColor = {
              type: "c",
              value: new THREE.Color("#7cff5c")
              //  #30D2BD
            }
          }

          if (name.indexOf(object.name) === 0) {
            /**
             * centeroid是活得地最准确的模型中心坐标
             * 只对该器官的第一个模型，器官名字进行位置变换操作
             * */
            MoveTargetCamera(object, radius)
            const centroid = new THREE.Vector3(0, 0, 0);
            centroid.addVectors(object.geometry.boundingBox.min, object.geometry.boundingBox.max);
            centroid.multiplyScalar(0.5);
            centroid.applyMatrix4(object.matrixWorld);


            choosenMesh = object;
            setThreeChoosenMesh(choosenMesh);
            // setDisplayType("inline")
            /**
             * 在这里动态生成信息窗口地内容
             * */

            GenerateCarousel(object.name, centroid, radius);
          }


        }
      }
    )

    setNowOrgaMeshes(meshList)


  }

  /**
   * 暴露给父组件地方法
   * */

  useImperativeHandle(onRef, () => ({
    // onChild 就是暴露给父组件的方法
    onChild: () => {
      return {
        childName: '我是子组件'
      }
    },

    testEnlarge: (name: any) => {
      enlargeItem(name)
    },

    testClose: () => {
      closeInfoWindow()
    },

    testPlay: (indexName: any) => {
      PlayAnimation(indexName);
    },
    setIndex: (index: any) => {
      setSelectedAbnormal(index);
    },
    setInfoTabs: () => {
      setInfoSelectedTab("2")
    },
    sliderDivIndex: (divIndex: any) => {
      SliderTo(divIndex)
    },

    // 恢复健康比对
    ResetCompare: () => {
      RestoreCompare();
    },

    //resetSliderValue
    resetSlider: () => {
      ResetAllOpacity();
    },


  }));


  /**
   * 根据器官或者身体地某部分生成一个走马灯中的元素
   * */
  const GenerateCarousel = (name: any, position: any, radius: any) => {

    if (dispatch) {
      dispatch({
        type: "bodyModel/getOrgaDetail",
        payload: {
          orgaParams: {orgaName: name}
        }
      })
    }


    /**
     * 在这里将信息船体元素作为css2Dobject加入场景
     * */
    const infoWindow = document.querySelector("#testAnt");

    const earthLabel = new CSS2DObject(infoWindow);
    earthLabel.name = "infoWindow";
    earthLabel.position.set(position.x - radius * 7 / 2, position.y - radius * 10 / 4, position.z);
    setCurrentInfoWindow(earthLabel);
    threeScence.add(earthLabel);
  }

  /**
   * 根据状态管理库相应的内容，将其格式化成跑马灯需要的
   * */

  useEffect(() => {
    structIllList();
  }, [illList]);


  /**
   * 在信息窗口，和右侧器官的异常标识，点击调用
   * */
  const PlayAnimation = (indexName: any) => {


    /**
     * 在这里进行操作动画，目前左侧栏已经可以，但是右侧栏目还不行
     * */
    //

    /**
     * 在这里根据异常标识的名字，选择数组里面的合适组，动画启动
     * 还需要一个方法，来根据器官的名字和异常标识获得动画名字， 再根据名字找到对应器官的动画，进行调用
     * */


    if (playedAnimationed) {
      playedAnimationed.stop();
    }

    const animationName = MatchIndexAnimaton(threeChoosenMesh.name, indexName)

    if (animationList[`${threeChoosenMesh.name}`] && threeChoosenMesh && animationName) {

      animationList[`${threeChoosenMesh.name}`].map(item => {
        if (item.indexName === animationName) {
          item.animationContent.play();
          setPlayedAnimationed(item.animationContent);
        }
      })
      // animationList[`${threeChoosenMesh.name}`][0].animationContent.play();
      // setPlayedAnimationed(animationList[`${threeChoosenMesh.name}`][0].animationContent);
    }
  }

  const structIllList = async () => {
    setInfoTitle(illList.name);
    setInfoDesc(illList.desc);
    const contentTemp: any = [];
    const imgTemp: any = [];


    if (illList.illType) {

      await illList.illType.map((item: any, index: any) => {
        contentTemp.push(
          <div key={item.illName}>
            <Row className={styles.illType}>
              {item.illName}
            </Row>
            <Row className={styles.illDesc}>
              {item.illDesc}
            </Row>
          </div>
        );
      })
      setContentList(contentTemp)
    }

    if (illList.orgaPicture) {
      await illList.orgaPicture.map((item: any, index: any) => {
        imgTemp.push(
          <Image
            key={index}
            // width={200}
            src={item}
          />
        );
      })
      setOrgaPicture(imgTemp)
    }
  }


  const RestoreCompare = async (modelTypeName: any) => {
    // 在这里目前仅仅是恢复了选中的器官模型，而没有恢复他的面片，实际上应该在这进行面片的恢复

    /**
     * 在这里根据需要回复的
     * */

    if (Array.isArray(nowOrgaMeshes) && nowOrgaMeshes.length > 0) {
      setInfoSelectedTab("0");
      nowOrgaMeshes.map((item: any) => {
        processGLTFChild(item, false)
      })

    }

    await threeObjects.forEach((object: any) => {

      object.visible = true;
    })


    switch (modelTypeName) {
      case "overWeight":
        await threeStandardObjects.forEach((object: any) => {
          object.visible = false;
        })
        break;
      case "fat":
        await threeStandardObjects.forEach((object: any) => {
          object.visible = false;
        })
        break;
      case "thinner":
        await threeStandardObjects.forEach((object: any) => {
          object.visible = false;
        })
        break;

      default:
        break;
    }
    /* if (modelTypeName === "overWeight") {
       await threeStandardObjects.forEach((object: any) => {
         object.visible = false;
       })
     } else if (modelTypeName === "fat") {
       await threeThinnerObjects.forEach((object: any) => {
         object.visible = false;
       })
     } else if (modelTypeName === "thinner") {
       await threeLighterObjects.forEach((object: any) => {
         object.visible = false;
       })
     }*/

  }

  const closeInfoWindow = async () => {

    /**
     * 关闭窗口的时候，将相关恢复
     * */

    await RestoreCompare("null");

    if (playedAnimationed) {
      playedAnimationed.stop()

    }
    setInfoSelectedTab("0");
    setPlayedAnimationed(null);
    setSelectedAbnormal(null);


    if (controlMaterial) {
      controlMaterial.visible = false;
      setControlMaterial(null);
    }

    currentInfoWindow.visible = false;
    setDisplayType("none");


    MoveTargetCamera();

    choosenMesh = null;
    setThreeChoosenMesh(choosenMesh);
    setNowOrgaMeshes([]);
    if (dispatch) {
      dispatch({
        type: "bodyModel/initSelectedOrga",
        payload: {
          newSelectedOrga: null
        }
      })
    }
  }

  /**
   * 一键切换按钮，对比不同模型
   * */

  const CompareStandardModel = () => {

  }

  /**
   * 信息串口，切换面板的时候，如果切换到异常标识，自动播放第一个异常标识的动画
   * */

  const ChangeIndex = (activeKey: any) => {
    if (playedAnimationed) {
      playedAnimationed.stop();
    }

    if (activeKey === "2") {
      //  打开默认的第一个动画
      illList.illType[0] ? PlayAnimation(illList.illType[0].illName) : null;
      changeTabs(illList.illType[0].illName);
    } else if (infoSelectedTab === "2") {
      ResstAllIllIndex()
    }

    setInfoSelectedTab(activeKey);
  }


  const SliderTo = (divIndex: any) => {
    if (sliderDivIndex) {
      sliderDivIndex.innerSlider.slickGoTo(divIndex);

    }
  }

  /**
   * 健康对比相关功能，这里主要是将场景中已经加载的正常模型和用户模型进行交替控制展示和隐藏
   * 这里传的参数为要对比的模型名字
   * */

  const ComparePartOrga = async (modelType: any) => {
    /**
     * 如果当前选中的器官模型有，就只是改变该模型，否则，改变所有的当前material可见的
     * */

    await threeObjects.forEach((signleOrga: any) => {
      // if (signleOrga.name === "Retopo_皮肤" || JudgeOrgaType(signleOrga.name) === 1) {
      signleOrga.visible = !signleOrga.visible;
      // }
    })

    if (modelType === "overWeight") {
      await threeStandardObjects.forEach((signleOrga: any) => {
        signleOrga.visible = !signleOrga.visible;
      })
    } else if (modelType === "fat") {
      await threeThinnerObjects.forEach((signleOrga: any) => {
        signleOrga.visible = !signleOrga.visible;
      })
    } else {
      await threeLighterObjects.forEach((signleOrga: any) => {
        signleOrga.visible = !signleOrga.visible;
      })
    }

  };


  /**
   * 关闭bmi框
   * */
  const closeModal = () => {
    modalForm.resetFields();
    setModalVisible(false);
  }


  /**
   * 当切换信息窗的异常标识的时候进行调用
   * */
  const changeTabs = async (value: any) => {
    /**
     * 在这里控制那个需要展示， 默认choosenMesh的不控制
     * 控制剩下的在保存中的
     * 切换到某个异常标识的时候就根据对应的异常标识进行场景中心的位置移动
     * */
    let illNameArray: any = [];
    if (Array.isArray(nowOrgaMeshes) && nowOrgaMeshes.length > 0) {
      // 因为片元的半径太小，所以用选中模型的
      const {radius, center} = threeChoosenMesh.geometry.boundingSphere;
      await nowOrgaMeshes.map((mesh: any) => {
        illNameArray = mesh.name.split("_");// 分割面片或者是器官模型的名字，如果是器官里面数组只有一个元素，否则最后一个元素就是名字


        if (threeChoosenMesh.name === illNameArray[illNameArray.length - 1] || value === illNameArray[illNameArray.length - 1]) {
          mesh.visible = true;
        } else {
          mesh.visible = false;
        }

        if (value === illNameArray[illNameArray.length - 1]) {
          //   位置移动

          MoveTargetCamera(mesh, radius)



        }
      })
    }


  };

  /**
   * 当信息窗离开异常标识的tab时候，全部恢复显示
   * */

  const ResstAllIllIndex = async () => {
    nowOrgaMeshes.map((mesh: any) => {
      mesh.visible = true;
    })


    //  回复位置
    const {radius, center} = threeChoosenMesh.geometry.boundingSphere;
    MoveTargetCamera(threeChoosenMesh,radius)

  }

  return (
    <div className={styles.output}>
      <div className={styles.webglOutput} id="webgl-output">

        <div id={"testAnt"} style={{display: displayType}} className={styles.infoCard}>

          <Tabs activeKey={infoSelectedTab}
                onChange={ChangeIndex}
                tabBarExtraContent={<CloseCircleOutlined onClick={closeInfoWindow} className={styles.closeIcon}/>}>
            <TabPane tab={infoTitle} key={"0"}>
              <Row id={"orgaDesc"} className={styles.organDesc}>
                {infoDesc}
              </Row> </TabPane>
            <TabPane tab={"医学影像"} key={"1"}>
              <Carousel effect={"fade"}>
                {orgaPicture}
              </Carousel> </TabPane>
            <TabPane tab={"异常标识"} key={"2"}>
              <Carousel
                ref={el => {
                  sliderDivIndex = el
                }}
                initialSlide={0}
                effect={"fade"}
                afterChange={(current: any) => {
                  PlayAnimation(illList.illType[current].illName);
                  changeTabs(illList.illType[current].illName)
                }}>
                {contentList}
              </Carousel>
            </TabPane>
          </Tabs>
        </div>

      </div>
      {threeChoosenMesh ? "" :
        <div className={styles.switchGroup}>
          <div className={styles.compareButton}

               onMouseDown={() => ComparePartOrga("overWeight")}
               onMouseUp={() => RestoreCompare("overWeight")}
               onMouseOut={() => RestoreCompare("overWeight")}
          >
            <img className={styles.compareIcon} src={'./img/compare_icon.svg'}/>
            <a className={styles.compareText}>健康对比（超重身材）</a>
          </div>
        </div>


      }
      {threeChoosenMesh ? "" : <Slider min={0}
                                       max={orgaTypeList.length - 1}
                                       step={0.05}
                                       reverse={true}
                                       tipFormatter={formatter}
                                       vertical
                                       value={sliderValue}
                                       onChange={sliderChange}
                                       className={styles.sliderBar}/>}


    </div>
  )
}

// export default BodyModel;
export default connect(({bodyModel}) => ({
  bodyModelInfo: bodyModel,
}))(BodyModel);

