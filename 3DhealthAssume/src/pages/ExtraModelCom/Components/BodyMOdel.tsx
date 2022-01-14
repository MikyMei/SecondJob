/**

 * @author MikyMei

 * @date 2021-11-22 15:14

 */


import React, {useEffect, useState, useImperativeHandle} from 'react';
import {connect, history, Dispatch} from "umi";
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';


import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

import {CSS2DObject, CSS2DRenderer} from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import {CSS3DObject, CSS3DRenderer} from 'three/examples/jsm/renderers/CSS3DRenderer.js';


import styles from './index.less';
import {Avatar, Badge, Button, Slider, Tooltip, Row, Col, Divider, Tag, Carousel, Tabs, Image} from "antd";
import Utils from "@/pages/ExtraModelCom/utils";
import * as TWEEN from '@tweenjs/tween.js';
import {AntDesignOutlined, CloseCircleOutlined, UserOutlined} from "@ant-design/icons";


const BodyModel: React.FC = (props: { onRef: any, currentOrga: any, orgaDescription: any, illTypeList: any, dispatch: Dispatch, bodyModelInfo: any }) => {


  const { TabPane } = Tabs;
  const {onRef, currentOrga, orgaDescription, illTypeList, dispatch, bodyModelInfo} = props;


  const {illList} = bodyModelInfo;
  const loader = new GLTFLoader();


  /**
   *beIntersectObjects是用来存放需要射线检测的物体数组。
   *transformControl可以方便调节物体位置大小。
   * */
  let scene: any;
  const objects: any = [];
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
  const matchType = ["皮肤", "骨骼", "内脏", ""];
  const matchMesh = [["Body002"], ["Circulatory_Heart001"], ["Skeletal001"], []];

  const orgaNameList = ["Retopo_跟骨",
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
    "Retopo_生殖系统",
    "Retopo_静脉",
    "Retopo_动脉",
    "Retopo_大脑",
    "Retopo_消化系统",
    "Retopo_小肠",
    "Retopo_胃部",
    "Retopo_肝脏",
    "Retopo_支气管",
    "Retopo_肺",
    "Retopo_肾脏",
    "Retopo_心脏",
    "Retopo_皮肤"];  //
  const orgaTypeList = [["Retopo_皮肤"],
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
      "Retopo_脊柱"],
    ["Retopo_生殖系统",
      "Retopo_静脉",
      "Retopo_动脉",
      "Retopo_大脑",
      "Retopo_消化系统",
      "Retopo_小肠",
      "Retopo_胃部",
      "Retopo_肝脏",
      "Retopo_支气管",
      "Retopo_肺",
      "Retopo_肾脏",
      "Retopo_心脏"],
    []
  ];  // 根据器官将他们分为不同的部分，首先要知道他有几类

  const orgaMatchColor = {
    "Retopo_生殖系统": "#fcafaf",
    "Retopo_静脉": "#b8c7bf",
    "Retopo_动脉": "#fb7f68",
    "Retopo_大脑": "#caadb1",
    "Retopo_消化系统": "#e8e1c0",
    "Retopo_小肠": "#fff1d2",
    "Retopo_胃部": "#f78b7a",
    "Retopo_肝脏": "#ee934c",
    "Retopo_支气管": "#cc594b",
    "Retopo_肺": "#ea5d69",
    "Retopo_肾脏": "#e04903",
    "Retopo_心脏": "#f05552",
  }

  let choosenMesh: any;

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
  const [threeMainCanvas, setThreeMainCanvas] = useState<any>();
  const [threeAddTimer, setThreeAddTimer] = useState<any>(false);
  const [threeIsStart, setThreeIsStart] = useState<any>(false);
  const [threeTime, setThreeTime] = useState<any>({
    value: 0
  });
  const [threeStartTime, setThreeStartTime] = useState<any>({
    value: 0
  });

  const [bodyMaterial, setBodyMaterial] = useState<any>();// 主要用来存放body地material为的是能够更改流光
  const [threeChoosenMesh, setThreeChoosenMesh] = useState<any>();// 主要用来存放body地material为的是能够更改流光

  const [displayType, setDisplayType] = useState<any>("none");
  const [currentInfoWindow, setCurrentInfoWindow] = useState<any>(); // 在选定器官的时候打开指定的信息窗口，
  const [controlMaterial, setControlMaterial] = useState<any>(); // 保存起初就是不展示的器官，在点击之后再显示


  const initModel = () => {


    // 获得渲染器长度
    mainCanvas = document.getElementById("webgl-output");


    /**
     * 结束
     * */


    const textureLoader = new THREE.TextureLoader();
    scene = new THREE.Scene();
    /**
     *  只是将图片作为北京图片贴了上去，并没有实现3d效果，尤其是在进行旋转的时候感觉尤为明显
     *  */
    scene.background = textureLoader.load('./img/sceneBackground.png');

    // 获得渲染器所在的标签元素，作为渲染器的尺寸
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor(new THREE.Color("#eeeeee"));
    renderer.setSize(mainCanvas.offsetWidth, mainCanvas.offsetHeight);
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
    circle.position.set(0, -4, 0);
    scene.add(circle);


    // 2d渲染器
    labelRenderer = new CSS2DRenderer();  // 新增的渲染器
    labelRenderer.setSize(mainCanvas.offsetWidth, mainCanvas.offsetHeight);
    // this.labelRenderer.domElement.style.position = 'absolute';
    // this.labelRenderer.domElement.style.top = 0;
    labelRenderer.domElement.style = "pointer-events: auto;position: absolute;top: 0px;"  // 处理新的渲染器


    const axes = new THREE.AxisHelper(20);
    // scene.add(axes);


    // 创建聚光灯
    spotLight = new THREE.SpotLight(0xFFFFFF);
    spotLight.position.set(30, 30, 30);
    spotLight.castShadow = true;
    spotLight.angle = Math.PI / 10;
    spotLight.shadow.penumbra = 0.05;
    spotLight.shadow.mapSize.width = 3026;
    spotLight.shadow.mapSize.height = 3026;
    scene.add(spotLight);

    ambient = new THREE.AmbientLight(0x444444);
    scene.add(ambient);

    point = new THREE.PointLight(0xffffff);
    point.position.set(400, 200, 300); // 点光源位置
    scene.add(point);


    const planeGemometry = new THREE.PlaneGeometry(50, 30);
    const planeMeterial = new THREE.MeshStandardMaterial({
      color: 0xcccccc
    })
    plane = new THREE.Mesh(planeGemometry, planeMeterial);

    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0;
    plane.position.y = -4;
    plane.position.z = 0;
    plane.castShadow = true;
    plane.receiveShadow = true;
    // scene.add(plane);


    // mainCanvas.offsetWidth,mainCanvas.offsetHeight
    camera = new THREE.PerspectiveCamera(45, mainCanvas.offsetWidth / mainCanvas.offsetHeight, 0.1, 2000);

    // 定位相机，并且指向场景中心
    camera.position.x = 0;
    camera.position.y = 2;
    camera.position.z = 15;
    camera.lookAt(0, 0, 0);


    let model;
    loader.load('./img/bodyMale.gltf', function (gltf: any) {
        model = gltf.scene;
        model.scale.setScalar(5, 5, 5);
        model.position.setY(-4);

        /**
         * beIntersectObjects是用来存放需要射线检测的物体数组。
         * transformControl可以方便调节物体位置大小。
         * */


        scene.add(model);
        model.traverse((child: any) => {

            /**
             * 在这里将不同模型根据他的名字，将
             * */
            if (child.geometry) {
              child.geometry.computeBoundingBox();
              child.geometry.computeBoundingSphere()
            }

            processGLTFChild(child)
          }
        );

        // const animations = gltf.animations;
        const mixer = new THREE.AnimationMixer(model);
      },
      undefined

      , function (error) {

        console.error(error);

      });


    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;


    setThreeScene(scene);
    setThreeCamera(camera);
    setThreeLabelRenderer(labelRenderer);
    setThreeRenderer(renderer);
    setThreeControls(controls);
    setThreeObjects(objects);
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
      changeLoading(false)

    }, 1000)

    render();
    window.addEventListener('resize', onWindowResize);

    document.querySelector("#webgl-output");


  }


  const onWindowResize = () => {

    if (threeMainCanvas) {
      threeCamera.aspect = threeMainCanvas.offsetWidth / threeMainCanvas.offsetHeight;
      threeCamera.updateProjectionMatrix();

      threeRenderer.setSize(threeMainCanvas.offsetWidth, threeMainCanvas.offsetHeight);
      // threeLabelRenderer.setSize(window.innerWidth, threeMainCanvas.offsetHeight);


    }

  }


  // @ts-ignore
  const render = () => {


    /**
     * 实现身体扫光
     * */
    const dt = clock.getDelta();


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
    if (threeObjects.length > 0) {
      threeObjects[threeObjects.length - 1].material.uniforms.time = time;

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

    // if (threeChoosenMesh) {
    //   OpenInfoWindow();
    //
    // }

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
    });
    const material2 = new THREE.ShaderMaterial({
      uniforms: AeroSphere1.uniforms,
      vertexShader: AeroSphere1.vertexShader,
      fragmentShader: AeroSphere1.fragmentShader,
      blending: THREE.NormalBlending,
      transparent: true,
      depthWrite: false,
      visible: true,
    });
    const material3 = new THREE.ShaderMaterial({
      uniforms: AeroSphere3.uniforms,
      vertexShader: AeroSphere3.vertexShader,
      fragmentShader: AeroSphere3.fragmentShader,
      blending: THREE.NormalBlending,
      transparent: true,
      depthWrite: false,
      visible: false,
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
            gl_Position	= projectionMatrix * modelViewMatrix * vec4(position, 1);
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
          // if (uDiffusion.x > 0.5) {
          //     // 扩散速度
          //     float dTime = mod(time * uDiffusion.z, uRadius * 2.0);
          //     // 当前的离中心点距离
          //     float uLen = distanceTo(position2D, vec2(uCenter.x, uCenter.z));
          //     // 扩散范围
          //     if (uLen < dTime && uLen > dTime - uDiffusion.y) {
          //         // 颜色渐变
          //         float dIndex = sin((dTime - uLen) / uDiffusion.y );
          //         distColor = mix(uColor, distColor, dIndex);
          //     }
          // }

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


  const processGLTFChild = (child: any) => {

    try {
      if (child.isMesh) {
        objects.push(child);


        // 根据器官属于在哪个数组，判断属于哪一类，选择哪一类着色器材质
        const type = JudgeOrgaType(child.name);

        switch (type) {
          case 0:
            child.material = setCityMaterial(child).materialBody;

            child.castShadow = true;

            break;
          case 1:
            child.material = Shaders("#30D2BD").material2;
            child.castShadow = true;
            break;
          case 2:
            child.material = Shaders(orgaMatchColor[`${child.name}`]).material3;
            child.castShadow = true

            break;
          default:
            child.material = Shaders("#30D2BD").material2;
            child.castShadow = true;
            break;
        }
      }
    } catch (e) {
      console.log('error:', e)
      console.error('设置色彩出错, child:', child)
    }
  }


  useEffect(() => {

    initModel();

  }, [])


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
          new TWEEN.Tween(object.material.uniforms.coeficient)
            .to({type: 'f', value: 1}, 2000) // 在1s内移动至 (0, 0)
            .easing(TWEEN.Easing.Quadratic.InOut) // 使用缓动功能使的动画更加平滑

            .start()

        }

      })
    }


  }

  const sliderChange = (value: any) => {
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


        new TWEEN.Tween(object.material.uniforms.coeficient)
          .to({type: 'f', value: needOpacity}, 2000) // 在1s内移动至 (0, 0)
          .easing(TWEEN.Easing.Quadratic.InOut) // 使用缓动功能使的动画更加平滑
          .start()
      }
    })
  }


  /**
   * 点击打开进行展示模型
   * 参数为网格模型的名字
   * */

  const OpenInfoWindow = () => {

    const centroid = new THREE.Vector3(0, 0, 0);
    centroid.addVectors(threeChoosenMesh.geometry.boundingBox.min, threeChoosenMesh.geometry.boundingBox.max);
    centroid.multiplyScalar(0.5);
    centroid.applyMatrix4(threeChoosenMesh.matrixWorld);

    const {radius, center} = threeChoosenMesh.geometry.boundingSphere;
    const testAnt = document.getElementById("testAnt");
    // testAnt.style.display = "none";

    let newWorldVector = new THREE.Vector3(centroid.x - radius / 3, centroid.y, centroid.z);


    var standardVector1 = newWorldVector.project(threeCamera);
    // var standardVector1 = new THREE.Vector3(0,0,1);
    var a1 = threeMainCanvas.offsetWidth / 2;
    var b1 = threeMainCanvas.offsetHeight / 2;


    var x1 = Math.round((standardVector1.x) * a1 + a1);
    var y1 = Math.round(-standardVector1.y * b1 + b1);

    testAnt.style.top = y1 + 'px';
    testAnt.style.right = (threeMainCanvas.offsetWidth - x1) + 'px';


  }

  /**
   * 在人体模型的右侧防止一个器官的栏目，点击具体的栏目会直接展开栏目的模型, 在加载玩模型的时候在重置一个,
   * 不能使用多场景，只能使用图标，对性能要求第一点
   * */


  /**
   * 点击放大或者是打开器官的弹框，或者跳到指定位置
   * */
  const enlargeItem = async (name: any) => {


    if (controlMaterial) {
      controlMaterial.visible = false;
      setControlMaterial(null);
    }

    await threeObjects.forEach(object => {

        if (name === object.name) {

          const {radius, center} = object.geometry.boundingSphere;
          if (!object.material.visible) {
            setControlMaterial(object.material);
            object.material.visible = true;
          }

          /**
           * centeroid是活得地最准确的模型中心坐标
           * */
          const centroid = new THREE.Vector3(0, 0, 0);
          centroid.addVectors(object.geometry.boundingBox.min, object.geometry.boundingBox.max);
          centroid.multiplyScalar(0.5);
          centroid.applyMatrix4(object.matrixWorld);


          new TWEEN.Tween(threeCamera.position)
            .to({x: centroid.x, y: centroid.y * 1.1, z: centroid.z + radius * 13}, 3000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();

          new TWEEN.Tween(threeControls.target)
            .to({x: centroid.x, y: centroid.y, z: centroid.z}, 1500)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();

          choosenMesh = object;
          setThreeChoosenMesh(choosenMesh);
          // setDisplayType("inline")
          /**
           * 在这里动态生成信息窗口地内容
           * */

          GenerateCarousel(name, centroid, radius);

        }
      }
    )


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
    }

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
    earthLabel.position.set(position.x - radius * 10 / 2, position.y - radius * 10 / 4, position.z);
    setCurrentInfoWindow(earthLabel);
    threeScence.add(earthLabel);
  }

  /**
   * 根据状态管理库相应的内容，将其格式化成跑马灯需要的
   * */

  useEffect(() => {
    structIllList();
  }, [illList]);

  const structIllList = async () => {
    setInfoTitle(illList.name);
    setInfoDesc(illList.desc);
    const contentTemp: any = [];
    const imgTemp: any = [];
    if (illList.illType) {

      await illList.illType.map((item: any, index: any) => {
        contentTemp.push(
          <div key={index}>
            <Row className={styles.illType}>
              <Tag color="orange">{item.illName}</Tag>
            </Row>
            <Row className={styles.illDesc}>
              {item.illDesc}
            </Row>
          </div>
        );
      })
      setContentList(contentTemp)
    }

    if (illList.orgaPicture){
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


  const closeInfoWindow = () => {

    if (controlMaterial) {
      controlMaterial.visible = false;
      setControlMaterial(null);
    }

    currentInfoWindow.visible = false;
    setDisplayType("none");


    new TWEEN.Tween(threeCamera.position)
      .to({x: 0, y: 2, z: 15}, 1500)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .start();
    new TWEEN.Tween(threeControls.target)
      .to({x: 0, y: 0, z: 0}, 1500)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .start();
    choosenMesh = null;
    setThreeChoosenMesh(choosenMesh);
  }


  return (
    <div className={styles.output}>
      <div className={styles.webglOutput} id="webgl-output">

        <div id={"testAnt"} style={{display: displayType}} className={styles.infoCard}>

          <Tabs defaultActiveKey="1" tabBarExtraContent={<CloseCircleOutlined onClick={closeInfoWindow} className={styles.closeIcon} />}>
            <TabPane tab={infoTitle} key="1">
              <Row id={"orgaDesc"} className={styles.organDesc}>
                {infoDesc}
              </Row>            </TabPane>
            <TabPane tab={"医学影像"} key="2">
              <Carousel effect={"fade"}>
                {orgaPicture}
              </Carousel>            </TabPane>
            <TabPane tab={"异常标识"} key="3">
                <Carousel effect={"fade"}>
                  {contentList}
                </Carousel>
            </TabPane>
          </Tabs>


        </div>

      </div>

      <Slider min={0}
              max={3}
              step={0.1}
              reverse={true}
              tipFormatter={formatter}
              vertical
              onChange={sliderChange}
              className={styles.sliderBar}/>
    </div>
  )
}

// export default BodyModel;
export default connect(({bodyModel}) => ({
  bodyModelInfo: bodyModel,
}))(BodyModel);

