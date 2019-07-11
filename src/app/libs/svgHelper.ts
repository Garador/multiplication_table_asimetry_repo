import * as SVG from 'svg.js';
import * as $ from 'jquery';
import { CanonicPoint, JointPoint, Coords } from '../components/svg-chart/svg-chart.component';


export class SvgHelper {
	private static _instace:SvgHelper = new SvgHelper();
	private _svg:SVG.Doc;

	private constructor(){
	}

	public static get Instance():SvgHelper{
		return this._instace;
	}

	public initialize(containerId:string){
		if(this._svg){
			this._svg.clear();
		}else{
			this._svg = SVG(containerId);
		}
		this._svg.size($(`#${containerId}`).width(), $(`#${containerId}`).width())
		return this._svg;
	}

	/*
	doSomething() {
		function _recalculateContainerWidth() {
			window['graphData'].containerWidth = 400; //$("#graphContainer_a").width();
			window['graphData'].correctionA = (window['graphData'].containerWidth / 15);
		}

		window['graphData'] = {
			element: null,
			containerWidth: 300,
			circleData: {
				element: null,
				diameter: 0
			},
			points: [],
			correctionA: 20,
			correctionB: 2
		}

		function drawGraph() {
			if (!window['graphData'].element) {
				//window['graphData'].element = SVG('grapDrawing');
			} else {
				window['graphData'].element.clear();	//Clears the graph
			}
			window['graphData'].element.size(window['graphData'].containerWidth + window['graphData'].correctionA * 2, window['graphData'].containerWidth + window['graphData'].correctionA * 2);

			//We define the circle data element
			window['graphData'].circleData.diameter = Math.floor(window['graphData'].containerWidth);
			window['graphData'].circleData.element = window['graphData'].element.circle(window['graphData'].circleData.diameter);
			window['graphData'].circleData.element.fill("transparent").stroke({ width: 1, color: 'blue' });
			window['graphData'].circleData.element.move(window['graphData'].correctionA + 2, window['graphData'].correctionA + 2)

			//We plot the points
			let points = plotPoints(this.calcData.points, window['graphData'].circleData.diameter, window['graphData'].element);

			//We set the point labels
			plotLabels(points, window['graphData'].element);

			// We plot the lines
			plotLines(points, window['graphData'].correctionB, this.calcData.multiplier);
			window['graphData'].points = points;
		}

		//This function calculates and plot the actual lines agains the dots.
		function plotLines(points, correctionFactor, multFactor) {
			let plotResult = [];
			for (let i = 0; i < points.length; i++) {
				let spinFactor = 1;
				let plotPointNumber = (multFactor * i);
				if (plotPointNumber > points.length) {
					spinFactor = Math.floor(plotPointNumber / points.length);
					plotPointNumber -= (spinFactor * points.length);
				} else if (plotPointNumber == points.length) {
					continue;
				}
				let pointA = points[i];
				let pointB = undefined;

				//We search the point B
				for (let a = 0; a < points.length; a++) {
					if (points[a].position === plotPointNumber) {
						pointB = points[a];
					}
				}
				if (pointB) {
					plotLine(pointA, pointB, correctionFactor);
					console.log({
						pointA, pointB
					});
					plotResult.push({
						pointA, pointB
					})
				} else {
					console.log("Could not find point for pointA. Debug info:\n", {
						plotPointNumber, spinFactor, pointA, pointB
					});
				}
			}
			return plotResult;
		}

		function plotLine(pointA, pointB, correctionFactor) {
			window['graphData'].element.line(
				pointA['X'] + correctionFactor,
				pointA['Y'] + correctionFactor,
				pointB['X'] + correctionFactor,
				pointB['Y'] + correctionFactor)
				.stroke({ width: 2, color: 'blue' });
		}

		//This method plots the different points into the
		//element parameter (an SVG object)
		function plotPoints(points, diameter, element) {
			let builtPoints = [];// calculatePoints(points, diameter);
			for (let i = 0; i < builtPoints.length; i++) {
				builtPoints['dot'] = plotPoint(element, builtPoints[i]['X'], builtPoints[i]['Y']);
			}
			return builtPoints;
		}

		//This method plots the labels into the
		// element (an SVG) based on a series of points
		function plotLabels(points, element) {
			for (let i = 0; i < points.length; i++) {
				points[i].label = element.text(`${i}`).font({ fill: 'black', weight: 'bold' });
				points[i].label.move(points[i]['X'] + 5, points[i]['Y'])
			}
		}

		function _handleResize() {
			_recalculateContainerWidth();
		};

		//This method generates a point
		//into the SVG object parameter "element"
		function plotPoint(element, X, Y) {
			return element.circle(5).fill("black").move(Math.floor(X), Math.floor(Y));
		}

		//This methods listen to window resize events
		//in order to resize
		function listenWindowResize() {
			//$(window).resize(_handleResize);
		};

		//This actionates the calcualtions to draw
		//the canvas


		function initialize() {
			listenWindowResize();
			_recalculateContainerWidth();
		};

		initialize();
	}
	*/

	/*	This method build the locations for the points
		to be plotted agains the SVG object as canonical points
	*/
	getStartingPointCoords(pointsAmmount:number, diameter:number, correctionPixelsA:number):Coords[] {
		let degreeJump = (360 / pointsAmmount);
		let builtPoints:Coords[] = [];
		let order:number = 0;
		for (let deg = 360; deg > 0; deg -= degreeJump) {
			let point = this.calculateSinglePoint(deg, diameter, correctionPixelsA);
			builtPoints.push({
					x: point.X,
					y: point.Y,
					deg: deg
			});
			order++;
		}
		return builtPoints;
	}

	/**
	 * @description Translates Degrees to Radians
	 * @param deg Ammount of degrees
	 */
	degToRad(deg:number){
		return (deg * (Math.PI / 180));
	}

	/**
	 * @description This method takes the dev. and the radius, and
	 * generates a series of points into the space that
	 * represent the circle points to be plotted.
	 * @param deg Degrees relative to the point
	 * @param radius Radius related to the point
	 * @param position Position for 
	 * @param diameter Diameter of the circle
	 * @param correctionPixels Offet for adjusting each single point
	 */
	calculateSinglePoint(deg:number, diameter:number, correctionPixelsA:number) {
		let offsetLocation = (diameter/2);

		let X = offsetLocation + ((diameter/2) * Math.cos(this.degToRad(deg))) * -1;
		X += correctionPixelsA;
		let Y = (offsetLocation + ((diameter/2) * Math.sin(this.degToRad(deg))));
		Y += correctionPixelsA;
		if(deg == 40){
			console.log({
				X, Y
			});
		}
		return {
			X, Y
		};
	}

	/**
	 * @description Calculates start and end points for lines.
	 * @param pointsAmmount Ammounts of canonical points to calculate
	 * @param multFactor Multiplication factor provided on UI
	 * @param diameter Diameter of the circle
	 * @param correctionPx Correction pixels to apply
	 */
	calculatePointLocations(pointsAmmount:number, 
	multFactor:number, 
	diameter:number, 
	correctionPixelsA:number): CanonicPoint[] {
		//console.log({ pointsAmmount, multFactor, diameter, correctionPixelsA });
		let plotResult:CanonicPoint[] = [];
		let startPoints = this.getStartingPointCoords(pointsAmmount, diameter, correctionPixelsA);
		//console.log({startPoints});

		for (let i = 0; i < startPoints.length; i++) {
			let spinFactor = 1;		//How many spins it gives
			
			let plotPointNumber = Math.floor((multFactor * i));	//TODO Work with decimals
			
			if (plotPointNumber > pointsAmmount) {
				spinFactor = Math.floor(plotPointNumber / pointsAmmount);
				plotPointNumber -= (spinFactor * pointsAmmount);
			} else if (plotPointNumber == pointsAmmount) {
				continue;
			}

			let pointA:JointPoint = {
				label:`${i}`,
				labelObj:null,
				dot:null,
				location: startPoints[i]
			};



			let pointB_coords = this.calculateSinglePoint(startPoints[plotPointNumber].deg, diameter, correctionPixelsA)
			let labelB = parseInt((startPoints[plotPointNumber].deg/(360/pointsAmmount)).toFixed(2));
			let pointB:JointPoint = {
				label:`${labelB}`,
				dot:null,
				location: {
					x: pointB_coords.X,
					y: pointB_coords.Y,
					deg: startPoints[plotPointNumber].deg,
				},
				labelObj:null
			};
			plotResult.push({
				pointA, 
				pointB,
				line: null
			});
		}
		return plotResult;
	}

	/**
	 * @description Draws a point into two points
	 * @param element Element to draw the dots on
	 * @param point The point to enmark into it
	 * @returns An SVG.Circle object
	 */
	drawCanonicalPointLine(element:SVG.Doc, point:CanonicPoint, _correctionFactorPixelsB:number){

		point.pointA.dot = this.drawDot(element, point.pointA);
		//element.circle(5).fill("black");
		//point.pointA.dot.move(point.pointA.location.x, point.pointA.location.y);

		point.pointB.dot = this.drawDot(element, point.pointB);
		//point.pointB.dot = element.circle(5).fill("black");
		//point.pointB.dot.move(point.pointB.location.x, point.pointB.location.y);

		point.line = element.line(
			point.pointA.location.x+_correctionFactorPixelsB, point.pointA.location.y+_correctionFactorPixelsB,
			point.pointB.location.x+_correctionFactorPixelsB, point.pointB.location.y+_correctionFactorPixelsB,
		).stroke({width:2, color:'green'});
		return point;
	}

	drawCircle(element:SVG.Doc, diameter:number, correctionA:number){
		return element.circle(diameter).fill('transparent')
			.stroke({width:1, color:'black'})
			.move(correctionA+2, correctionA+2);;
	}

	drawDot(element:SVG.Doc, point:JointPoint){
		return element.circle(5).fill('black')
			.move(point.location.x, point.location.y);
	}

	drawLabels(element:SVG.Doc, point: CanonicPoint):CanonicPoint{
		point.pointA.labelObj = element.text(`${point.pointA.label}`)
		.fill('black')
		.font({'weight':'bold'})
		.move(point.pointA.location.x+5, point.pointA.location.y);

		point.pointB.labelObj = element.text(`${point.pointB.label}`)
		.fill('black')
		.font({'weight':'bold'})
		.move(point.pointB.location.x+5, point.pointB.location.y);
		return point;
	}

	/**
	 * @description Gets the degree value from a point,
	 * given a max. set of points.
	 */
	getDegreeFromPoint(point:number, points:number){
		let degA = (360/points)*point;
		return Math.floor(degA);
	}
	//8

	/**
	 * @description Draws a single label, based on the coordinates for a JointPoint object
	 * @param element Element to draw the label into
	 * @param point The point to get the coordinates
	 */
	drawLabel(element:SVG.Doc, point:JointPoint):JointPoint{
		point.labelObj =  element.text(`${point.label}`)
		.fill('black')
		.font({'weight':'bold'})
		.move(point.location.x+5, point.location.y);
		return point;
	}


}