import type { ColorType, EventData } from '../../../core/src/types'
import type { Placement } from '../types/Common'
import type { ComputedDatum } from '../types';


// -- base layer params --
export interface BaseBarsParams {
    barWidth: number;
    barPadding: number;
    barGroupPadding: number;
    barRadius: number | boolean;
}
export interface BaseStackedBarsParams {
    barWidth: number;
    barGroupPadding: number;
    barRadius: number | boolean;
}
export interface BaseBarsTriangleParams {
    barWidth: number;
    barPadding: number;
    barGroupPadding: number;
    linearGradientOpacity: [number, number];
}
export interface BaseDotsParams {
    radius: number;
    fillColorType: ColorType;
    strokeColorType: ColorType;
    strokeWidth: number;
    onlyShowHighlighted: boolean;
}
export interface BaseCategoryAxisParams {
    labelOffset: [number, number];
    labelColorType: ColorType;
    axisLineVisible: boolean;
    axisLineColorType: ColorType;
    ticks: number | null | 'all';
    tickFormat: string | ((text: any) => string | d3.NumberValue);
    tickLineVisible: boolean;
    tickPadding: number;
    tickFullLine: boolean;
    tickFullLineDasharray: string;
    tickColorType: ColorType;
    tickTextRotate: number;
    tickTextColorType: ColorType;
}
export interface BaseLegendParams {
    placement: Placement;
    padding: number;
    backgroundFill: ColorType;
    backgroundStroke: ColorType;
    textColorType: ColorType;
    gap: number;
    labelList: Array<{
        listRectWidth: number;
        listRectHeight: number;
        listRectRadius: number;
    }>;
}
export interface BaseLineAreasParams {
    lineCurve: string;
    linearGradientOpacity: [number, number];
}
export interface BaseLinesParams {
    lineCurve: string;
    lineWidth: number;
}
export interface BaseOrdinalBubblesParams {
    bubble: {
        sizeAdjust: number;
        arcScaleType: 'area' | 'radius';
        valueLinearOpacity: [number, number];
    };
    itemLabel: {
        padding: number;
        colorType: ColorType;
    };
    rankingAmount: 'auto' | number;
}
export interface BaseRacingBarsParams {
    bar: {
        barWidth: number;
        barPadding: number;
        barRadius: number | boolean;
    };
    rankingAmount: 'auto' | number;
}
export interface BaseRacingLabelsParams {
    barLabel: {
        position: 'inside' | 'outside' | 'none';
        padding: number;
        colorType: ColorType;
    };
    axisLabel: {
        offset: [number, number];
        colorType: ColorType;
    };
}
export interface BaseRacingValueLabelsParams {
    padding: number;
    colorType: ColorType;
    format: string | ((text: d3.NumberValue) => string | d3.NumberValue);
}
export interface BaseTooltipStyle {
    backgroundColor: string;
    backgroundOpacity: number;
    strokeColor: string;
    offset: [number, number];
    padding: number;
    textColor: string;
    textSize: number | string;
    textSizePx: number;
    // seriesColors: string[];
}
export interface BaseTooltipUtils {
    toCurrency: (num: number | null) => string;
    measureTextWidth(text: string, size?: number): number;
}
export type BaseTooltipParams = {
    backgroundColorType: ColorType;
    backgroundOpacity: number;
    strokeColorType: ColorType;
    textColorType: ColorType;
    offset: [number, number];
    padding: number;
    renderFn: ((eventData: EventData<any>, context: {
        styles: BaseTooltipStyle;
        utils: BaseTooltipUtils;
        seriesData: ComputedDatum<any>[]
        categoryData: ComputedDatum<any>[]
    }) => string[] | string);
};
export interface BaseValueAxisParams {
    labelOffset: [number, number];
    labelColorType: ColorType;
    axisLineVisible: boolean;
    axisLineColorType: ColorType;
    ticks: number;
    tickFormat: string | ((text: d3.NumberValue) => string | d3.NumberValue);
    tickLineVisible: boolean;
    tickPadding: number;
    tickFullLine: boolean;
    tickFullLineDasharray: string;
    tickColorType: ColorType;
    tickTextRotate: number;
    tickTextColorType: ColorType;
}
export interface BaseXAxisParams {
    labelOffset: [number, number];
    labelColorType: ColorType;
    axisLineVisible: boolean;
    axisLineColorType: ColorType;
    ticks: number | null;
    tickFormat: string | ((text: d3.NumberValue) => string | d3.NumberValue);
    tickLineVisible: boolean;
    tickPadding: number;
    tickFullLine: boolean;
    tickFullLineDasharray: string;
    tickColorType: ColorType;
    tickTextColorType: ColorType;
}
export interface BaseYAxisParams {
    labelOffset: [number, number];
    labelColorType: ColorType;
    axisLineVisible: boolean;
    axisLineColorType: ColorType;
    ticks: number | null;
    tickFormat: string | ((text: d3.NumberValue) => string | d3.NumberValue);
    tickLineVisible: boolean;
    tickPadding: number;
    tickFullLine: boolean;
    tickFullLineDasharray: string;
    tickColorType: ColorType;
    tickTextColorType: ColorType;
}
