import { Component, OnInit, ViewChild } from '@angular/core';
import { SvgChartComponent, CanonicPoint } from './components/svg-chart/svg-chart.component';
//declare var SVG:any;

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	title = 'app1';

	multiplierFactor:number = 2;
	pointsAmmount:number = 10;
	private _loaded:boolean = false;
	drawResult:{
		points:CanonicPoint[],
		multiplier: number
	} = null;

	@ViewChild("mainSvgChart") svgComponent: SvgChartComponent;

	ngOnInit() {
		
	}

	calculate() {
		this.svgComponent.drawGraph();
	}

	public getReverseBLabel(i:number){
		if(i == 0)
		return;

		let reversedResult = this.drawResult.points[this.drawResult.points.length-i];		
		if(reversedResult){
			return reversedResult.pointB.label;
		}
	}

	drewChart(resultA:{points:CanonicPoint[]}){
		this.drawResult = this.drawResult ? this.drawResult : <any>{};
		this._loaded = true;
		this.drawResult.points = resultA.points;
		this.drawResult.multiplier = this.multiplierFactor;
		//console.log(this.drawResult.points);
	}


}
