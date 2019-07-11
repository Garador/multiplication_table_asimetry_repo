import { Component, OnInit, OnChanges, SimpleChanges, Input, AfterContentInit, Output, EventEmitter } from "@angular/core";
import { SvgHelper } from "../../libs/svgHelper";
import * as $ from 'jquery';
import * as SVG from 'svg.js'


export interface CanonicPoint {
	pointA: JointPoint,
	pointB: JointPoint,
	line: SVG.Line
}
export interface JointPoint {
	label:string,
	labelObj: SVG.Text,
	dot: SVG.Circle,
	location:Coords
}
export interface Coords {
	x: number,
	y: number,
	deg:number
}
@Component({
	selector: "app-svg-chart",
	templateUrl: "./svg-chart.component.html",
	styleUrls: ["./svg-chart.component.scss"]
})
export class SvgChartComponent implements OnInit, AfterContentInit {
	private _canonicPointsAmmount:number;
	private _multFactor:number;
	private _containerId:string = "svgComponentContainer";
	private _svgHelper: SvgHelper = SvgHelper.Instance;
	private _correctionFactorPixelsA:number = 20;
	private _correctionFactorPixelsB:number = 2;
	private _svgContainerDimensionA:number = 350;

	private _svgDoc: SVG.Doc;
	private _canonicPoints:CanonicPoint[];
	private _circleDiameter:number = 300;
	private _svgCircle: SVG.Circle;

	@Output("generateEmitter") private _resultEmitter = new EventEmitter();

	@Input("multFactor")
	public set multFactor(ammount:number){
		this._multFactor = ammount;
	};
	public get multFactor(){
		return this._multFactor;
	};

	@Input("canonicPointsAmmount")
	public set canonicPointsAmmount(ammount:number){
		this._canonicPointsAmmount = ammount;
	};
	public get canonicPointsAmmount(){
		return this._canonicPointsAmmount;
	};

	constructor() {
	}

	ngOnInit() {
	}

	ngAfterContentInit(){
		console.log("Started svg chart...");
		this._svgDoc = this._svgHelper.initialize(this._containerId);
		$(window).resize(()=>{
			//console.log("Resized...");
			//this._svgHelper.initialize(this._containerId);
			//this.calculateDimensions();
		});
		this.drawGraph();
	}

	/**
	 * @description Calculates the dimensions for the container
	 */
	calculateDimensions(){
		this._svgContainerDimensionA = $(`#${this._containerId}`).width();
		if(this._svgContainerDimensionA > $(window).height()*.80){
			this._svgContainerDimensionA = $(window).height()*.80;
		}
		this._circleDiameter = this._svgContainerDimensionA*0.80;
		this._correctionFactorPixelsA = this._svgContainerDimensionA*.12;
		this._correctionFactorPixelsB = 2;
	}

	
	/**
	 * @description Draws the SVG graph with the lines
	 */
	public drawGraph(){
		if(this._canonicPointsAmmount < 1 || this._multFactor < 1){
			return;
		}
		this._svgHelper.initialize(this._containerId);
		this.calculateDimensions();
		this._svgCircle = this.plotCircle();
		this._canonicPoints = this.plotLines();
		this.plotLabels(this._canonicPoints);
		this._resultEmitter.emit({points:this._canonicPoints})
	}

	public plotLines() {
		let _canonicPoints = this._svgHelper.calculatePointLocations(
		this._canonicPointsAmmount,
		this._multFactor,
		this._circleDiameter, 
		this._correctionFactorPixelsA);

		for(let i=0;i<_canonicPoints.length;i++){
			_canonicPoints[i] = this._svgHelper.drawCanonicalPointLine(this._svgDoc, _canonicPoints[i], this._correctionFactorPixelsB);
		}
		//console.log(_canonicPoints);
		return _canonicPoints;
	}

	public plotCircle(){
		return this._svgHelper.drawCircle(this._svgDoc, this._circleDiameter, this._correctionFactorPixelsA);
	}

	public plotLabels(lines:CanonicPoint[]){
		//element:SVG.Doc, point:JointPoint
		let labelsMade = [];
		for(let i=0;i<this._canonicPointsAmmount;i++){
			let foundLabel = lines.find((point)=>{
				return point.pointA.label === `${i}`
			});

			/*
			this._svgDoc.circle(30)
			.move(this._svgCircle.cx(), this._svgCircle.cy())
			.fill('red')
			.width(5);
			*/

			if(foundLabel){
				lines[lines.indexOf(foundLabel)].pointA = this._svgHelper.drawLabel(this._svgDoc, this._svgCircle, foundLabel.pointA);

				console.log({
					label: `${lines[lines.indexOf(foundLabel)].pointA.label}`,
					i: i,
					deg: lines[lines.indexOf(foundLabel)].pointA.location.deg
				});
			}else{
				let degree = this._svgHelper.getDegreeFromPoint(i, this._canonicPointsAmmount);
				let xy = this._svgHelper.calculateSinglePoint(degree, this._circleDiameter, this._correctionFactorPixelsA);
				let point:JointPoint = {
					label: `${i}`,
					labelObj: null,
					dot: null,
					location: {
						x: xy.X-1,
						y: xy.Y-1,
						deg: degree
					}
				}
				
				point.dot = this._svgHelper.drawDot(this._svgDoc, point);
				point = this._svgHelper.drawLabel(this._svgDoc, this._svgCircle, point);
				labelsMade.push(i);
			}
			/*
			if(
				lines[i] &&
				labelsMade.indexOf(lines[i].pointA.label) < 0)
			{
					labelsMade.push(lines[i].pointA.label);
					lines[i].pointA = this._svgHelper.drawLabel(this._svgDoc, lines[i].pointA);
			}
			*/
		}
		/*
		let labelsMade = [];
		for(let i=0;i<lines.length;i++){
			if(labelsMade.indexOf(lines[i].pointA.label) < 0){
				if(i == this._canonicPointsAmmount){
					continue;
				}
				console.log("Plotting: ",lines[i].pointA.label);
				lines[i].pointA = this._svgHelper.drawLabel(this._svgDoc, lines[i].pointA);
				labelsMade.push(lines[i].pointA.label);
			}
		}

		//Normalize: 9 // 45

		//Normalize Labels
		labelsMade = labelsMade.map((el)=>{
			return parseInt(el);
		});

		if(labelsMade.length < this._canonicPointsAmmount){
			for(let i=1;i<this._canonicPointsAmmount-1;i++){
				if(labelsMade.indexOf(i)<0){
					let degree = this._svgHelper.getDegreeFromPoint(i, this._canonicPointsAmmount);
					let xy = this._svgHelper.calculateSinglePoint(degree, this._circleDiameter, this._correctionFactorPixelsA);
					let point:JointPoint = {
						label: `${i}`,
						labelObj: null,
						dot: null,
						location: {
							x: xy.X-1,
							y: xy.Y-1,
							deg: degree
						}
					}
					point.dot = this._svgHelper.drawDot(this._svgDoc, point);
					point = this._svgHelper.drawLabel(this._svgDoc, point);
					labelsMade.push(i);
					console.log(point);
				}
			}
		}
		console.log(labelsMade);
		*/
	}
}
