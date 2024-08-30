const E={id:"CP_BOTTOM_AND_LEFT_PADDING_WITH_SERIES_HIGHLIGHT",description:"間距下面及左邊留空",data:{padding:{top:60,right:60,bottom:120,left:160},highlightTarget:"series"}},S={id:"CP_BOTTOM_AND_LEFT_PADDING",description:"間距下面及左邊留空",data:{padding:{top:60,right:60,bottom:120,left:160}}},G={id:"CP_BOTTOM_LONG_PADDING",description:"間距下面加長留空",data:{padding:{top:60,right:60,bottom:160,left:60}}},O={id:"CP_BOTTOM_LONG_PADDING_WITH_SERIES_HIGHLIGHT",description:"間距下面加長留空及highlight系列",data:{padding:{top:60,right:60,bottom:160,left:60},highlightTarget:"series"}},D={id:"CP_BOTTOM_PADDING_WITH_GROUP_HIGHLIGHT",description:"間距下面留空及highlight群組",data:{padding:{top:60,right:60,bottom:120,left:60},highlightTarget:"group"}},R={id:"CP_BOTTOM_PADDING_WITH_GROUP_HIGHLIGHT",description:"間距下面留空及highlight系列",data:{padding:{top:60,right:60,bottom:120,left:60},highlightTarget:"series"}},l={id:"CP_BOTTOM_PADDING",description:"間距下面留空",data:{padding:{top:60,right:60,bottom:120,left:60}}},c={id:"CP_BOTTOM_SLIGHT_PADDING",description:"間距下面些微留空",data:{padding:{top:40,right:40,bottom:60,left:40}}},A={id:"CP_LEFT_PADDING",description:"間距左邊留空",data:{padding:{top:60,right:60,bottom:60,left:160}}},N={id:"CP_TOP_AND_NO_BOTTOM_PADDING",description:"間距上面留空下面不留空",data:{padding:{top:120,right:120,bottom:0,left:60}}},p={id:"CP_RIGHT_PADDING",description:"間距右邊留空",data:{padding:{top:60,right:120,bottom:60,left:60}}},u=Object.freeze(Object.defineProperty({__proto__:null,CP_BOTTOM_AND_LEFT_PADDING:S,CP_BOTTOM_AND_LEFT_PADDING_WITH_SERIES_HIGHLIGHT:E,CP_BOTTOM_LONG_PADDING:G,CP_BOTTOM_LONG_PADDING_WITH_SERIES_HIGHLIGHT:O,CP_BOTTOM_PADDING:l,CP_BOTTOM_PADDING_WITH_GROUP_HIGHLIGHT:D,CP_BOTTOM_PADDING_WITH_SERIES_HIGHLIGHT:R,CP_BOTTOM_SLIGHT_PADDING:c,CP_LEFT_PADDING:A,CP_RIGHT_PADDING:p,CP_TOP_AND_NO_BOTTOM_PADDING:N},Symbol.toStringTag,{value:"Module"})),g={},m=Object.freeze(Object.defineProperty({__proto__:null,temp:g},Symbol.toStringTag,{value:"Module"})),M={id:"PP_BUBBLES_SCALING_BY_RADIUS",chartType:"series",pluginName:"Bubbles",description:"以半徑尺寸為比例的泡泡圖",data:{bubbleScaleType:"radius"}},U={id:"PP_PIE_DONUT",chartType:"series",pluginName:"Pie",description:"甜甜圈圖",data:{innerRadius:.5}},B={id:"PP_PIE_HALF_DONUT",chartType:"series",pluginName:"Pie",description:"半圓甜甜圈圖",data:{innerRadius:.5,startAngle:-Math.PI/2,endAngle:Math.PI/2}},H={id:"PP_PIE_LABELS_HALF_ANGLE",chartType:"series",pluginName:"PieLabels",description:"半圓甜甜圈資料標籤",data:{startAngle:-Math.PI/2,endAngle:Math.PI/2}},h={id:"PP_PIE_LABELS_INNER",chartType:"series",pluginName:"PieLabels",description:"圖內資料標籤",data:{labelCentroid:1.3,labelColorType:"primary"}},C={id:"PP_SERIES_LEGEND_BOTTOM",chartType:"series",pluginName:"SeriesLegend",description:"圓型圖例列點",data:{listRectRadius:7}},F=Object.freeze(Object.defineProperty({__proto__:null,PP_BUBBLES_SCALING_BY_RADIUS:M,PP_PIE_DONUT:U,PP_PIE_HALF_DONUT:B,PP_PIE_LABELS_HALF_ANGLE:H,PP_PIE_LABELS_INNER:h,PP_SERIES_LEGEND_ROUND:C},Symbol.toStringTag,{value:"Module"})),y={id:"DF_GRID_BOTTOM_VALUE_AXIS",chartType:"grid",description:"底部橫向資料圖軸",data:{grid:{valueAxis:{position:"bottom"},groupAxis:{position:"left"}}}},b={id:"DF_GRID_BOTTOM_VALUE_AXIS_AND_NONE_GROUP_SCALE_PADDING",chartType:"grid",description:"底部橫向資料圖軸及無群組圖軸的左右間距",data:{grid:{valueAxis:{position:"bottom"},groupAxis:{position:"left",scalePadding:0}}}},W={id:"DF_GRID_2_SERIES_SLOT",chartType:"grid",description:"2個Series Slot",data:{grid:{seriesSlotIndexes:[0,1]},container:{rowAmount:1,columnAmount:2}}},x={id:"DF_GRID_3_SERIES_SLOT",chartType:"grid",description:"3個Series Slot",data:{grid:{seriesSlotIndexes:[0,1,2]},container:{rowAmount:1,columnAmount:3}}},f={id:"DF_GRID_4_SERIES_SLOT",chartType:"grid",description:"4個Series Slot",data:{grid:{seriesSlotIndexes:[0,1,2,3]},container:{rowAmount:2,columnAmount:2}}},X={id:"DF_GRID_DIVERGING_SCALE",chartType:"grid",description:"分向資料圖軸",data:{grid:{valueAxis:{scaleDomain:["auto","auto"],scaleRange:[.05,.95]}}}},V={id:"DF_GRID_NONE_GROUP_SCALE_PADDING",chartType:"grid",description:"無群組圖軸的左右間距",data:{grid:{groupAxis:{scalePadding:0}}}},j={id:"DF_LINE_AREAS_2_SERIES_SLOT",chartType:"grid",description:"LineAreas 2個Series Slot",data:{grid:{seriesSlotIndexes:[0,1],groupAxis:{scalePadding:0}},container:{rowAmount:1,columnAmount:2}}},v={id:"DF_LINE_AREAS_3_SERIES_SLOT",chartType:"grid",description:"LineAreas 3個Series Slot",data:{grid:{seriesSlotIndexes:[0,1,2],groupAxis:{scalePadding:0}},container:{rowAmount:1,columnAmount:3}}},z={id:"DF_LINE_AREAS_4_SERIES_SLOT",chartType:"grid",description:"LineAreas 4個Series Slot",data:{grid:{seriesSlotIndexes:[0,1,2,3],groupAxis:{scalePadding:0}},container:{rowAmount:2,columnAmount:2}}},K=Object.freeze(Object.defineProperty({__proto__:null,DF_GRID_2_SERIES_SLOT:W,DF_GRID_3_SERIES_SLOT:x,DF_GRID_4_SERIES_SLOT:f,DF_GRID_BOTTOM_VALUE_AXIS:y,DF_GRID_BOTTOM_VALUE_AXIS_AND_NONE_GROUP_SCALE_PADDING:b,DF_GRID_DIVERGING_SCALE:X,DF_GRID_NONE_GROUP_SCALE_PADDING:V,DF_LINE_AREAS_2_SERIES_SLOT:j,DF_LINE_AREAS_3_SERIES_SLOT:v,DF_LINE_AREAS_4_SERIES_SLOT:z},Symbol.toStringTag,{value:"Module"})),w={id:"PP_BARS_ROUND",chartType:"grid",pluginName:"Bars",description:"圓角長條圖",data:{barWidth:0,barPadding:1,barGroupPadding:10,barRadius:!0}},k={id:"PP_BARS_THIN",chartType:"grid",pluginName:"Bars",description:"圓角長條圖",data:{barWidth:20,barPadding:1,barGroupPadding:10}},Y={id:"PP_DOTS_ONLY_SHOW_HIGHLIGHTED",chartType:"grid",pluginName:"Dots",description:"顯示highlight圓點",data:{onlyShowHighlighted:!1}},Z={id:"PP_DOTS_SOLID",chartType:"grid",pluginName:"Dots",description:"實心圓點",data:{radius:3,fillColorType:"series",onlyShowHighlighted:!1}},$={id:"PP_GRID_LEGEND_BOTTOM_WITH_LINE_LIST",chartType:"grid",pluginName:"GridLegend",description:"底部圖例及線條列點",data:{position:"bottom",justify:"center",padding:14,listRectHeight:2}},q={id:"PP_GRID_LEGEND_BOTTOM_WITH_ROUND_LIST",chartType:"grid",pluginName:"GridLegend",description:"底部圖例及圓弧列點",data:{position:"bottom",justify:"center",padding:14,listRectRadius:7}},J={id:"PP_GRID_LEGEND_BOTTOM",chartType:"grid",pluginName:"GridLegend",description:"底部圖例",data:{position:"bottom",justify:"center",padding:14}},Q={id:"PP_GROUP_AXIS_ROTATE_LABEL",chartType:"grid",pluginName:"GroupAxis",description:"群組圖軸標籤文字傾斜",data:{tickPadding:15,tickTextRotate:-30}},__={id:"PP_LINES_CURVE",chartType:"grid",pluginName:"Lines",description:"圓弧折線圖",data:{lineCurve:"curveMonotoneX",lineWidth:3}},t_={id:"PP_LINE_AREAS_CURVE",chartType:"grid",pluginName:"LineAreas",description:"圓弧折線圖",data:{lineCurve:"curveMonotoneX"}},I_=Object.freeze(Object.defineProperty({__proto__:null,PP_BARS_ROUND:w,PP_BARS_THIN:k,PP_DOTS_ONLY_SHOW_HIGHLIGHTED:Y,PP_DOTS_SOLID:Z,PP_GRID_LEGEND_BOTTOM:J,PP_GRID_LEGEND_BOTTOM_WITH_LINE_LIST:$,PP_GRID_LEGEND_BOTTOM_WITH_ROUND_LIST:q,PP_GROUP_AXIS_ROTATE_LABEL:Q,PP_LINES_CURVE:__,PP_LINE_AREAS_CURVE:t_},Symbol.toStringTag,{value:"Module"})),i_={id:"DF_MULTI_GRID_2_GRID_SLOT",chartType:"multiGrid",description:"2個Grid Slot",data:{gridList:[{},{slotIndex:1}],container:{rowAmount:1,columnAmount:2}}},a_={id:"DF_MULTI_GRID_3_GRID_SLOT",chartType:"multiGrid",description:"3個Grid Slot",data:{gridList:[{slotIndex:0},{slotIndex:1},{slotIndex:2}],container:{rowAmount:1,columnAmount:3}}},T_={id:"DF_MULTI_GRID_4_GRID_SLOT",chartType:"multiGrid",description:"4個Grid Slot",data:{gridList:[{slotIndex:0},{slotIndex:1},{slotIndex:2},{slotIndex:3}],container:{rowAmount:2,columnAmount:2}}},P_=Object.freeze(Object.defineProperty({__proto__:null,DF_MULTI_GRID_2_GRID_SLOT:i_,DF_MULTI_GRID_3_GRID_SLOT:a_,DF_MULTI_GRID_4_GRID_SLOT:T_},Symbol.toStringTag,{value:"Module"})),e_={id:"PP_MULTI_BARS_2_GRID_SLOT",chartType:"multiGrid",pluginName:"MultiBars",description:"2組群組長條圖",data:{gridIndexes:[0,1]}},r_={id:"PP_MULTI_BARS_3_GRID_SLOT",chartType:"multiGrid",pluginName:"MultiBars",description:"3組群組長條圖",data:{gridIndexes:[0,1,2]}},d_={id:"PP_MULTI_BARS_4_GRID_SLOT",chartType:"multiGrid",pluginName:"MultiBars",description:"4組群組長條圖",data:{gridIndexes:[0,1,2,3]}},s_={id:"PP_MULTI_BARS_ROUND",chartType:"multiGrid",pluginName:"MultiBars",description:"圓角長條圖",data:{barWidth:0,barPadding:1,barGroupPadding:10,barRadius:!0}},L_={id:"PP_MULTI_BAR_STACK_2_GRID_SLOT",chartType:"multiGrid",pluginName:"MultiBarStack",description:"2組堆疊長條圖",data:{gridIndexes:[0,1]}},n_={id:"PP_MULTI_BAR_STACK_3_GRID_SLOT",chartType:"multiGrid",pluginName:"MultiBarStack",description:"3組堆疊長條圖",data:{gridIndexes:[0,1,2]}},o_={id:"PP_MULTI_BAR_STACK_4_GRID_SLOT",chartType:"multiGrid",pluginName:"MultiBarStack",description:"4組堆疊長條圖",data:{gridIndexes:[0,1,2,3]}},E_={id:"PP_MULTI_BARS_TRIANGLE_2_GRID_SLOT",chartType:"multiGrid",pluginName:"MultiBarsTriangle",description:"2組群組三角長條圖",data:{gridIndexes:[0,1]}},S_={id:"PP_MULTI_BARS_TRIANGLE_3_GRID_SLOT",chartType:"multiGrid",pluginName:"MultiBarsTriangle",description:"3組群組三角長條圖",data:{gridIndexes:[0,1,2]}},G_={id:"PP_MULTI_BARS_TRIANGLE_4_GRID_SLOT",chartType:"multiGrid",pluginName:"MultiBarsTriangle",description:"4組群組三角長條圖",data:{gridIndexes:[0,1,2,3]}},O_={id:"PP_MULTI_LINES_2_GRID_SLOT",chartType:"multiGrid",pluginName:"MultiLines",description:"2組折線圖",data:{gridIndexes:[0,1]}},D_={id:"PP_MULTI_LINES_3_GRID_SLOT",chartType:"multiGrid",pluginName:"MultiLines",description:"3組折線圖",data:{gridIndexes:[0,1,2]}},R_={id:"PP_MULTI_LINES_4_GRID_SLOT",chartType:"multiGrid",pluginName:"MultiLines",description:"4組折線圖",data:{gridIndexes:[0,1,2,3]}},l_={id:"PP_MULTI_LINES_CURVE",chartType:"multiGrid",pluginName:"MultiLines",description:"圓弧折線圖",data:{lineCurve:"curveMonotoneX",lineWidth:3}},c_={id:"PP_MULTI_GRID_LEGEND_BOTTOM_WITH_LINE_LIST",chartType:"multiGrid",pluginName:"MultiGridLegend",description:"底部圖例線條列點",data:{position:"bottom",justify:"center",padding:14,gridList:[{listRectHeight:2},{listRectHeight:2},{listRectHeight:2},{listRectHeight:2}]}},A_={id:"PP_MULTI_GRID_LEGEND_BOTTOM_WITH_RECT_AND_LINE_LIST",chartType:"multiGrid",pluginName:"MultiGridLegend",description:"底部圖例矩型及線條列點",data:{position:"bottom",justify:"center",padding:14,gridList:[{},{listRectHeight:2}]}},N_={id:"PP_MULTI_GRID_LEGEND_BOTTOM_WITH_ROUND_AND_LINE_LIST",chartType:"multiGrid",pluginName:"MultiGridLegend",description:"底部圖例圓型及線條列點",data:{position:"bottom",justify:"center",padding:14,gridList:[{listRectRadius:7},{listRectHeight:2}]}},p_={id:"PP_MULTI_GRID_LEGEND_BOTTOM",chartType:"multiGrid",pluginName:"MultiGridLegend",description:"底部圖例",data:{position:"bottom",justify:"center",padding:14}},u_={id:"PP_MULTI_GROUP_AXIS_2_GRID_SLOT",chartType:"multiGrid",pluginName:"MultiGroupAxis",description:"2個群組圖軸",data:{tickTextRotate:-30,gridIndexes:[0,1]}},g_={id:"PP_MULTI_GROUP_AXIS_3_GRID_SLOT",chartType:"multiGrid",pluginName:"MultiGroupAxis",description:"3個群組圖軸",data:{tickTextRotate:-30,gridIndexes:[0,1,2]}},m_={id:"PP_MULTI_GROUP_AXIS_4_GRID_SLOT",chartType:"multiGrid",pluginName:"MultiGroupAxis",description:"4個群組圖軸",data:{tickTextRotate:-30,gridIndexes:[0,1,2,3]}},M_={id:"PP_MULTI_VALUE_AXIS_2_GRID_SLOT",chartType:"multiGrid",pluginName:"MultiValueAxis",description:"2個資料圖軸",data:{gridIndexes:[0,1]}},U_={id:"PP_MULTI_VALUE_AXIS_3_GRID_SLOT",chartType:"multiGrid",pluginName:"MultiValueAxis",description:"3個資料圖軸",data:{gridIndexes:[0,1,2]}},B_={id:"PP_MULTI_VALUE_AXIS_4_GRID_SLOT",chartType:"multiGrid",pluginName:"MultiValueAxis",description:"4個資料圖軸",data:{gridIndexes:[0,1,2,3]}},H_=Object.freeze(Object.defineProperty({__proto__:null,PP_MULTI_BARS_2_GRID_SLOT:e_,PP_MULTI_BARS_3_GRID_SLOT:r_,PP_MULTI_BARS_4_GRID_SLOT:d_,PP_MULTI_BARS_ROUND:s_,PP_MULTI_BARS_TRIANGLE_2_GRID_SLOT:E_,PP_MULTI_BARS_TRIANGLE_3_GRID_SLOT:S_,PP_MULTI_BARS_TRIANGLE_4_GRID_SLOT:G_,PP_MULTI_BAR_STACK_2_GRID_SLOT:L_,PP_MULTI_BAR_STACK_3_GRID_SLOT:n_,PP_MULTI_BAR_STACK_4_GRID_SLOT:o_,PP_MULTI_GRID_LEGEND_BOTTOM:p_,PP_MULTI_GRID_LEGEND_BOTTOM_WITH_LINE_LIST:c_,PP_MULTI_GRID_LEGEND_BOTTOM_WITH_RECT_AND_LINE_LIST:A_,PP_MULTI_GRID_LEGEND_BOTTOM_WITH_ROUND_AND_LINE_LIST:N_,PP_MULTI_GROUP_AXIS_2_GRID_SLOT:u_,PP_MULTI_GROUP_AXIS_3_GRID_SLOT:g_,PP_MULTI_GROUP_AXIS_4_GRID_SLOT:m_,PP_MULTI_LINES_2_GRID_SLOT:O_,PP_MULTI_LINES_3_GRID_SLOT:D_,PP_MULTI_LINES_4_GRID_SLOT:R_,PP_MULTI_LINES_CURVE:l_,PP_MULTI_VALUE_AXIS_2_GRID_SLOT:M_,PP_MULTI_VALUE_AXIS_3_GRID_SLOT:U_,PP_MULTI_VALUE_AXIS_4_GRID_SLOT:B_},Symbol.toStringTag,{value:"Module"})),h_={},C_=Object.freeze(Object.defineProperty({__proto__:null,temp:h_},Symbol.toStringTag,{value:"Module"})),F_={},y_=Object.freeze(Object.defineProperty({__proto__:null,temp:F_},Symbol.toStringTag,{value:"Module"})),b_={},W_=Object.freeze(Object.defineProperty({__proto__:null,temp:b_},Symbol.toStringTag,{value:"Module"})),x_={},f_=Object.freeze(Object.defineProperty({__proto__:null,temp:x_},Symbol.toStringTag,{value:"Module"})),X_={},V_=Object.freeze(Object.defineProperty({__proto__:null,temp:X_},Symbol.toStringTag,{value:"Module"})),j_={id:"PP_TREE_LEGEND_BOTTOM",chartType:"tree",pluginName:"TreeLegend",description:"底部圖例",data:{position:"bottom",justify:"center",padding:14}},v_=Object.freeze(Object.defineProperty({__proto__:null,PP_TREE_LEGEND_BOTTOM:j_},Symbol.toStringTag,{value:"Module"})),d={series:m,grid:K,multiGrid:P_,multiValue:C_,relationship:W_,tree:V_},e={series:F,grid:I_,multiGrid:H_,multiValue:y_,relationship:f_,tree:v_},T=(t,a)=>{const s=a.chartParamsId?u[a.chartParamsId].data:void 0,L=d[t][a.dataFormatterId]?d[t][a.dataFormatterId].data:void 0,n=a.allPluginParamsIds?a.allPluginParamsIds.reduce((r,P)=>{if(e[t][P]){const o=e[t][P].pluginName;r[o]=e[t][P].data}return r},{}):void 0;return{chartParams:s,dataFormatter:L,allPluginParams:n}},i=t=>T("series",t),_=t=>T("grid",t),I=t=>T("multiGrid",t),z_=t=>T("tree",t);i({allPluginParamsIds:[],description:"基本Series參數"});const K_=i({allPluginParamsIds:["PP_SERIES_LEGEND_ROUND"],description:"基本泡泡圖"}),w_=i({allPluginParamsIds:["PP_BUBBLES_SCALING_BY_RADIUS","PP_SERIES_LEGEND_ROUND"],description:"以半徑尺寸為比例的泡泡圖"}),k_=i({allPluginParamsIds:["PP_SERIES_LEGEND_ROUND"],description:"基本圓餅圖"}),Y_=i({allPluginParamsIds:["PP_PIE_LABELS_INNER","PP_SERIES_LEGEND_ROUND"],description:"圓餅圖及內部資料標籤"}),Z_=i({allPluginParamsIds:["PP_PIE_DONUT","PP_SERIES_LEGEND_ROUND"],description:"甜甜圈圖"}),$_=i({chartParamsId:"CP_TOP_AND_NO_BOTTOM_PADDING",allPluginParamsIds:["PP_PIE_HALF_DONUT","PP_PIE_LABELS_HALF_ANGLE","PP_SERIES_LEGEND_ROUND"],description:"半圓甜甜圈圖"}),q_=_({chartParamsId:"CP_BOTTOM_PADDING",allPluginParamsIds:["PP_GRID_LEGEND_BOTTOM"],description:"基本Grid參數"}),J_=_({chartParamsId:"CP_BOTTOM_LONG_PADDING",allPluginParamsIds:["PP_GROUP_AXIS_ROTATE_LABEL","PP_GRID_LEGEND_BOTTOM"],description:"傾斜標籤"}),Q_=_({chartParamsId:"CP_BOTTOM_AND_LEFT_PADDING",dataFormatterId:"DF_GRID_BOTTOM_VALUE_AXIS",allPluginParamsIds:["PP_GRID_LEGEND_BOTTOM"],description:"橫向圖"}),_t=_({chartParamsId:"CP_BOTTOM_PADDING",dataFormatterId:"DF_GRID_DIVERGING_SCALE",allPluginParamsIds:["PP_GRID_LEGEND_BOTTOM"],description:"正負值分向圖"}),tt=_({chartParamsId:"CP_BOTTOM_LONG_PADDING",dataFormatterId:"DF_GRID_2_SERIES_SLOT",allPluginParamsIds:["PP_GROUP_AXIS_ROTATE_LABEL","PP_GRID_LEGEND_BOTTOM"],description:"2組Series圖表"}),It=_({chartParamsId:"CP_BOTTOM_LONG_PADDING",dataFormatterId:"DF_GRID_3_SERIES_SLOT",allPluginParamsIds:["PP_GROUP_AXIS_ROTATE_LABEL","PP_GRID_LEGEND_BOTTOM","PP_GROUP_AXIS_ROTATE_LABEL"],description:"3組Series圖表"}),it=_({chartParamsId:"CP_BOTTOM_LONG_PADDING",dataFormatterId:"DF_GRID_4_SERIES_SLOT",allPluginParamsIds:["PP_GROUP_AXIS_ROTATE_LABEL","PP_GRID_LEGEND_BOTTOM"],description:"4組Series圖表"}),at=_({chartParamsId:"CP_BOTTOM_PADDING",allPluginParamsIds:["PP_BARS_ROUND","PP_GRID_LEGEND_BOTTOM_WITH_ROUND_LIST"],description:"圓角長條圖"}),Tt=_({chartParamsId:"CP_BOTTOM_AND_LEFT_PADDING",dataFormatterId:"DF_GRID_BOTTOM_VALUE_AXIS",allPluginParamsIds:["PP_BARS_ROUND","PP_GRID_LEGEND_BOTTOM_WITH_ROUND_LIST"],description:"橫向圓角長條圖"}),Pt=_({chartParamsId:"CP_BOTTOM_PADDING",allPluginParamsIds:["PP_BARS_THIN","PP_GRID_LEGEND_BOTTOM"],description:"細長條圖"}),et=_({chartParamsId:"CP_BOTTOM_AND_LEFT_PADDING",dataFormatterId:"DF_GRID_BOTTOM_VALUE_AXIS",allPluginParamsIds:["PP_BARS_ROUND","PP_GRID_LEGEND_BOTTOM_WITH_ROUND_LIST"],description:"橫向圓角長條圖"}),rt=_({chartParamsId:"CP_BOTTOM_PADDING_WITH_SERIES_HIGHLIGHT",allPluginParamsIds:["PP_GRID_LEGEND_BOTTOM_WITH_LINE_LIST"],description:"基本Grid參數"}),dt=_({chartParamsId:"CP_BOTTOM_LONG_PADDING_WITH_SERIES_HIGHLIGHT",allPluginParamsIds:["PP_GROUP_AXIS_ROTATE_LABEL","PP_GRID_LEGEND_BOTTOM_WITH_LINE_LIST"],description:"傾斜標籤"}),st=_({chartParamsId:"CP_BOTTOM_AND_LEFT_PADDING_WITH_SERIES_HIGHLIGHT",dataFormatterId:"DF_GRID_BOTTOM_VALUE_AXIS",allPluginParamsIds:["PP_GRID_LEGEND_BOTTOM_WITH_LINE_LIST"],description:"橫向折線圖"}),Lt=_({chartParamsId:"CP_BOTTOM_PADDING_WITH_SERIES_HIGHLIGHT",allPluginParamsIds:["PP_LINES_CURVE","PP_GRID_LEGEND_BOTTOM_WITH_LINE_LIST"],description:"弧線折線圖"}),nt=_({chartParamsId:"CP_BOTTOM_PADDING_WITH_GROUP_HIGHLIGHT",allPluginParamsIds:["PP_DOTS_ONLY_SHOW_HIGHLIGHTED","PP_GRID_LEGEND_BOTTOM_WITH_LINE_LIST"],description:"折線圖及Highlight Group圓點"}),ot=_({chartParamsId:"CP_BOTTOM_PADDING_WITH_SERIES_HIGHLIGHT",dataFormatterId:"DF_GRID_NONE_GROUP_SCALE_PADDING",allPluginParamsIds:["PP_GRID_LEGEND_BOTTOM_WITH_LINE_LIST"],description:"基本Grid參數"}),Et=_({chartParamsId:"CP_BOTTOM_LONG_PADDING_WITH_SERIES_HIGHLIGHT",dataFormatterId:"DF_GRID_NONE_GROUP_SCALE_PADDING",allPluginParamsIds:["PP_GROUP_AXIS_ROTATE_LABEL","PP_GRID_LEGEND_BOTTOM_WITH_LINE_LIST"],description:"傾斜標籤"}),St=_({chartParamsId:"CP_BOTTOM_AND_LEFT_PADDING_WITH_SERIES_HIGHLIGHT",dataFormatterId:"DF_GRID_BOTTOM_VALUE_AXIS_AND_NONE_GROUP_SCALE_PADDING",allPluginParamsIds:["PP_GRID_LEGEND_BOTTOM_WITH_LINE_LIST"],description:"橫向折線圖"}),Gt=_({chartParamsId:"CP_BOTTOM_PADDING_WITH_SERIES_HIGHLIGHT",dataFormatterId:"DF_GRID_NONE_GROUP_SCALE_PADDING",allPluginParamsIds:["PP_LINES_CURVE","PP_LINE_AREAS_CURVE","PP_GRID_LEGEND_BOTTOM_WITH_LINE_LIST"],description:"弧線折線圖"}),Ot=_({chartParamsId:"CP_BOTTOM_PADDING_WITH_GROUP_HIGHLIGHT",dataFormatterId:"DF_GRID_NONE_GROUP_SCALE_PADDING",allPluginParamsIds:["PP_DOTS_ONLY_SHOW_HIGHLIGHTED","PP_GRID_LEGEND_BOTTOM_WITH_LINE_LIST"],description:"折線圖及Highlight Group圓點"}),Dt=_({chartParamsId:"CP_BOTTOM_LONG_PADDING",dataFormatterId:"DF_LINE_AREAS_2_SERIES_SLOT",allPluginParamsIds:["PP_GROUP_AXIS_ROTATE_LABEL","PP_GRID_LEGEND_BOTTOM"],description:"2組Series圖表"}),Rt=_({chartParamsId:"CP_BOTTOM_LONG_PADDING",dataFormatterId:"DF_LINE_AREAS_3_SERIES_SLOT",allPluginParamsIds:["PP_GROUP_AXIS_ROTATE_LABEL","PP_GRID_LEGEND_BOTTOM","PP_GROUP_AXIS_ROTATE_LABEL"],description:"3組Series圖表"}),lt=_({chartParamsId:"CP_BOTTOM_LONG_PADDING",dataFormatterId:"DF_LINE_AREAS_4_SERIES_SLOT",allPluginParamsIds:["PP_GROUP_AXIS_ROTATE_LABEL","PP_GRID_LEGEND_BOTTOM"],description:"4組Series圖表"}),ct=I({chartParamsId:"CP_BOTTOM_PADDING_WITH_SERIES_HIGHLIGHT",allPluginParamsIds:["PP_MULTI_GRID_LEGEND_BOTTOM_WITH_RECT_AND_LINE_LIST"],description:"基本MultiGrid參數"}),At=I({chartParamsId:"CP_BOTTOM_PADDING_WITH_SERIES_HIGHLIGHT",allPluginParamsIds:["PP_MULTI_GRID_LEGEND_BOTTOM_WITH_ROUND_AND_LINE_LIST","PP_MULTI_BARS_ROUND","PP_MULTI_LINES_CURVE"],description:"MultiGrid圓弧風格"}),Nt=I({chartParamsId:"CP_BOTTOM_LONG_PADDING",dataFormatterId:"DF_MULTI_GRID_2_GRID_SLOT",allPluginParamsIds:["PP_MULTI_GRID_LEGEND_BOTTOM","PP_MULTI_GROUP_AXIS_2_GRID_SLOT","PP_MULTI_VALUE_AXIS_2_GRID_SLOT","PP_MULTI_BARS_2_GRID_SLOT","PP_MULTI_BAR_STACK_2_GRID_SLOT","PP_MULTI_BARS_TRIANGLE_2_GRID_SLOT","PP_MULTI_LINES_2_GRID_SLOT"],description:"2組Grid圖表"}),pt=I({chartParamsId:"CP_BOTTOM_LONG_PADDING",dataFormatterId:"DF_MULTI_GRID_3_GRID_SLOT",allPluginParamsIds:["PP_MULTI_GRID_LEGEND_BOTTOM","PP_MULTI_GROUP_AXIS_3_GRID_SLOT","PP_MULTI_VALUE_AXIS_3_GRID_SLOT","PP_MULTI_BARS_3_GRID_SLOT","PP_MULTI_BAR_STACK_3_GRID_SLOT","PP_MULTI_BARS_TRIANGLE_3_GRID_SLOT","PP_MULTI_LINES_3_GRID_SLOT"],description:"3組Grid圖表"}),ut=I({chartParamsId:"CP_BOTTOM_LONG_PADDING",dataFormatterId:"DF_MULTI_GRID_4_GRID_SLOT",allPluginParamsIds:["PP_MULTI_GRID_LEGEND_BOTTOM","PP_MULTI_GROUP_AXIS_4_GRID_SLOT","PP_MULTI_VALUE_AXIS_4_GRID_SLOT","PP_MULTI_BARS_4_GRID_SLOT","PP_MULTI_BAR_STACK_4_GRID_SLOT","PP_MULTI_BARS_TRIANGLE_4_GRID_SLOT","PP_MULTI_LINES_4_GRID_SLOT"],description:"4組Grid圖表"}),gt=I({chartParamsId:"CP_BOTTOM_LONG_PADDING",dataFormatterId:"DF_MULTI_GRID_2_GRID_SLOT",allPluginParamsIds:["PP_MULTI_GRID_LEGEND_BOTTOM_WITH_LINE_LIST","PP_MULTI_GROUP_AXIS_2_GRID_SLOT","PP_MULTI_VALUE_AXIS_2_GRID_SLOT","PP_MULTI_BARS_2_GRID_SLOT","PP_MULTI_BAR_STACK_2_GRID_SLOT","PP_MULTI_BARS_TRIANGLE_2_GRID_SLOT","PP_MULTI_LINES_2_GRID_SLOT"],description:"2組折線圖表"}),mt=I({chartParamsId:"CP_BOTTOM_LONG_PADDING",dataFormatterId:"DF_MULTI_GRID_3_GRID_SLOT",allPluginParamsIds:["PP_MULTI_GRID_LEGEND_BOTTOM_WITH_LINE_LIST","PP_MULTI_GROUP_AXIS_3_GRID_SLOT","PP_MULTI_VALUE_AXIS_3_GRID_SLOT","PP_MULTI_BARS_3_GRID_SLOT","PP_MULTI_BAR_STACK_3_GRID_SLOT","PP_MULTI_BARS_TRIANGLE_3_GRID_SLOT","PP_MULTI_LINES_3_GRID_SLOT"],description:"3組折線圖表"}),Mt=I({chartParamsId:"CP_BOTTOM_LONG_PADDING",dataFormatterId:"DF_MULTI_GRID_4_GRID_SLOT",allPluginParamsIds:["PP_MULTI_GRID_LEGEND_BOTTOM_WITH_LINE_LIST","PP_MULTI_GROUP_AXIS_4_GRID_SLOT","PP_MULTI_VALUE_AXIS_4_GRID_SLOT","PP_MULTI_BARS_4_GRID_SLOT","PP_MULTI_BAR_STACK_4_GRID_SLOT","PP_MULTI_BARS_TRIANGLE_4_GRID_SLOT","PP_MULTI_LINES_4_GRID_SLOT"],description:"4組折線圖表"}),Ut=z_({chartParamsId:"CP_BOTTOM_SLIGHT_PADDING",allPluginParamsIds:["PP_TREE_LEGEND_BOTTOM"],description:"基本Tree參數"});export{Dt as A,Rt as B,lt as C,Nt as D,pt as E,ut as F,ct as G,At as H,gt as I,mt as J,Mt as K,Ut as L,K_ as P,w_ as a,k_ as b,Y_ as c,Z_ as d,$_ as e,q_ as f,J_ as g,Q_ as h,at as i,Tt as j,Pt as k,et as l,tt as m,It as n,it as o,_t as p,rt as q,dt as r,st as s,Lt as t,nt as u,ot as v,Et as w,St as x,Gt as y,Ot as z};
