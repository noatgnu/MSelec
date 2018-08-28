import {Component, OnInit, AfterViewInit, OnDestroy, ElementRef, Input} from '@angular/core';
import { D3Service, D3, Selection } from 'd3-ng2-service';
import {MsDataService} from '../../helper/ms-data.service';
import {MsSpectrum} from '../../helper/ms-spectrum';




@Component({
  selector: 'app-ms-spectrum-viewer',
  templateUrl: './ms-spectrum-viewer.component.html',
  styleUrls: ['./ms-spectrum-viewer.component.css']
})
export class MsSpectrumViewerComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() data: MsSpectrum;
  @Input() mode: string;
  private allowedX = ['RT', 'MZ'];
  private parentNativeEnviroment: any;
  private d3Obj: D3;
  private event;
  private zoom = false;
  private brush;
  constructor(element: ElementRef, private d3: D3Service, private spectrum: MsDataService) {
    this.parentNativeEnviroment = element.nativeElement;
    this.d3Obj = d3.getD3();
  }
  enableZoom() {
    if (this.zoom === false) {
      const graphBlock = this.d3Obj.select(this.parentNativeEnviroment).select('svg').select('.graphBlock');
      const a = graphBlock.append('g').attr('class', 'brush').call(this.brush);
    } else {
      this.d3Obj.select(this.parentNativeEnviroment).select('svg').select('.graphBlock').selectAll('.brush').remove();
    }
    this.zoom = !this.zoom;
  }

  ngOnInit() {
    const mode = this.mode;
    const d3Local = this.d3Obj;
    const frame = {width: 1280, height: 720};
    const margin = {top: 20, right: 20, bottom: 30, left: 40};
    const width = frame.width - margin.left - margin.right;
    const height = frame.height - margin.top - margin.bottom;
    const bound = this.GetXYBound(this.mode);
    const spectrumService = this.spectrum;
    let previewLineHorizontal;
    let previewLineVertical;
    let svg: any;
    console.log(bound);
    if (this.parentNativeEnviroment != null) {
      svg = d3Local.select(this.parentNativeEnviroment).append('svg')
        /*.attr('width', frame.width).attr('height', frame.height);*/
        .attr('viewBox', '0 0 ' + frame.width + ' ' + frame.height);
      const x = spectrumService.GetXAxis(d3Local, width, bound.x.xMax + bound.x.xMax / 10);
      const xAxis = d3Local.axisBottom(x);
      const y = spectrumService.GetYAxis(d3Local, height, bound.y.yMax + bound.y.yMax / 10);
      const yAxis = d3Local.axisLeft(y);

      const graphBlock = svg.append('g').attr('class', 'graphBlock').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
      const backgroundBlock = graphBlock.append('g').attr('class', 'background');
      const background = backgroundBlock.append('rect').attr('width', width).attr('height', height)
        .style('fill', 'transparent')
        .style('stroke', 'black')
        .style('stroke-width', 0.5);

      const previewBlock = graphBlock.append('g').attr('class', 'preview-block');
      previewLineHorizontal = previewBlock.append('line').attr('id', 'preview-horizontal')
        .attr('x1', x(0)).attr('x2', width).attr('y1', y(0)).attr('y2', y(0));
      previewLineVertical = previewBlock.append('line').attr('id', 'preview-vertical')
        .attr('x1', x(0)).attr('x2', x(0)).attr('y1', y(0)).attr('y2', height - y(0));
      const preview = (d, i) => {
        const mouseCoord = d3Local.mouse(d3Local.event.currentTarget);
        const xInvert = x.invert(mouseCoord[0]);
        const yInvert = y.invert(mouseCoord[1]);
        previewLineHorizontal.style('stroke', 'black').style('stroke-width', 0.25)
          .transition().duration(250).ease(d3Local.easeLinear)
          .attr('y1', mouseCoord[1]).attr('y2', mouseCoord[1]);
        previewLineVertical.style('stroke', 'black').style('stroke-width', 0.25)
          .transition().duration(250).ease(d3Local.easeLinear)
          .attr('x1', mouseCoord[0]).attr('x2', mouseCoord[0]);
      };

      graphBlock.on('mousemove', preview).on('mouseover', preview);

      const peaks = graphBlock.selectAll('.peaks').data(this.data.Values);
      const peakBlocks = peaks.enter().append('g').attr('class', 'peak-block');
      const peak = peakBlocks.append('line')
        .attr('x1', function (d) {
        return x(d[mode]);
      }).attr('x2', function (d) {
        return x(d[mode]);
      }).attr('y1', function() {
        console.log(y(0));
        return y(0);
        })
        .attr('y2', y(0))
        .style('stroke-width', 2).style('stroke', 'black').attr('class', 'peak');
      const drag = this.drag(d3Local);

      const brush = this.brushed(d3Local, x, y, bound.x.xMax + bound.x.xMax / 10, bound.y.yMax + bound.y.yMax / 10, graphBlock, xAxis, yAxis, mode, [[0, 0], [width, height]]);
      this.brush = brush;
      const peakLabelBlock = peakBlocks.append('g').attr('class', 'label-block');
      const peakLabelPoint = peakLabelBlock.append('circle').attr('class', 'label-point').attr('r', 3).attr('cx', function (d) {
        return x(d[mode]);
      }).attr('cy', y(0) - 7).attr('x0', function (d) {
        return x(d[mode]);
      }).attr('x0', function (d) {
        return x(d[mode]);
      }).attr('y0', function (d) {
        return y(d.Intensity) - 7;
      }).call(drag);
      const peakLabelText = peakLabelBlock.append('text').attr('class', 'label-text')
        .style('stroke', 'black').attr('x', function (d) {
        return x(d[mode]);
      }).attr('y', y(0) - 12).text(function (d) {
        return d.MZ;
      });

      peak.transition().duration(1000).attr('y2', function (d) {
        return y(d.Intensity);
      });
      peakLabelPoint.transition().duration(1000).attr('cy', function (d) {
        return y(d.Intensity) - 7;
      });
      peakLabelText.transition().duration(1000).attr('y', function (d) {
        return y(d.Intensity) - 12;
      });


        background.on('mouseout', function () {
        previewLineVertical.style('stroke', null);
        previewLineHorizontal.style('stroke', null);
      });
      /*const peak = peakBlocks.append('rect').attr('x', function(d) {
        return x(d[mode]);
      }).attr('y', function(d) {
        return y(d.Intensity);
      }).attr('width', 10).attr('height', y(0));
      peak.transition().duration(1000).attr('height', function (d) {
        return height - y(d.Intensity);
      }).style('fill', 'black');*/

      const xAxisBlock = graphBlock.append('g').attr('class', 'bottom-axis')
        .attr('transform', 'translate(0,' + height + ')').call(xAxis);
      const yAxisBlock = graphBlock.append('g').attr('class', 'left-axis').call(yAxis);

      // peakBlocks.exit().remove();
      // const a = graphBlock.append('g').attr('class', 'brush').call(brush);
      // console.log(a);
      svg.exit();
    }
  }

  private brushed(d3Local: D3, x, y, maxX, maxY, svg, xAxis, yAxis, mode, brushArea) {
    let idleTimeout;
    const idleDelay = 350;
    const brush = d3Local.brush().extent(brushArea).on('end', function () {
      const s = d3Local.event.selection;
      console.log(s);
      if (!s) {
        if (!idleTimeout) {
          return idleTimeout = setTimeout(function idled() {idleTimeout = null; }, idleDelay);
        }
        x.domain([0, maxX]);
        y.domain([0, maxY]);
      } else {
        x.domain([s[0][0], s[1][0]].map(x.invert, x));
        y.domain([s[1][1], s[0][1]].map(y.invert, y));
        const b = svg.select('.brush').call(brush.move, null);
      }
      console.log(x.domain());
      const t = svg.transition().duration(750);
      const newX = svg.select('.bottom-axis').transition(t).call(xAxis);
      const newY = svg.select('.left-axis').transition(t).call(yAxis);
      const peaks = svg.selectAll('.peak').transition(t).attr('x1', function (d) {
        return x(d[mode]);
      }).attr('x2', function (d) {
        return x(d[mode]);
      }).attr('y1', function() {
        return y(y.domain()[0]);
      })
        .attr('y2', function (d) {
          return y(d.Intensity);
        });
      const points = svg.selectAll('.label-point').transition(t).attr('cx', function (d) {
        return x(d[mode]);
      }).attr('cy', function (d) {
        return y(d.Intensity) - 7;
      });
      const texts = svg.selectAll('.label-text').transition(t).attr('x', function (d) {
        return x(d[mode]);
      }).attr('y', function (d) {
        return y(d.Intensity) - 12;
      });
    });
    return brush;
  }

  private drag(d3Local) {
    return d3Local.drag().on('start', function (d, i, n) {
      const circle = d3Local.select(n[i]);
      const guideBlock = d3Local.select(<HTMLElement>circle.node().parentNode).append('g');
      const guide = guideBlock.append('line').attr('class', 'guide-line')
        .attr('x1', circle.attr('x0'))
        .attr('x2', circle.attr('x0'))
        .attr('y1', circle.attr('y0'))
        .attr('y2', circle.attr('y0'));
    })
      .on('drag', function (d, i, n) {
        const circle = d3Local.select(n[i]).attr('cx', d3Local.event.x).attr('cy', d3Local.event.y);
        const parent = d3Local.select(<HTMLElement>circle.node().parentNode);
        const text = parent.select('text').attr('x', d3Local.event.x).attr('y', d3Local.event.y - 5);
        const guide = parent.select('.guide-line').attr('x2', d3Local.event.x - 6).attr('y2', d3Local.event.y + 3);
        // const text = d3Local.select(d3Local.event.currentTarget).select('text').attr('x', d3Local.event.x).attr('y', d3Local.event.y - 5);
      }).on('end', function (d, i, n) {
        const circle = d3Local.select(n[i]);
        const parent = d3Local.select(<HTMLElement>circle.node().parentNode);
        const guide = parent.select('.guide-line');
        const x1 = +guide.attr('x1');
        const x2 = +guide.attr('x2');
        const y1 = +guide.attr('y1');
        const y2 = +guide.attr('y2');
        const result = Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
        console.log(result);
        if (result < 3 * 2 + 6) {
          console.log(result);
          guide.remove();
        }
      });
  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {

  }

  GetXYBound(mode: string) {
    const xbound = {xMin: null, xMax: null};
    const ybound = {yMin: null, yMax: null};
    if (this.allowedX.includes(mode)) {
      for (const i of this.data.Values) {
        for (const b of Object.keys(xbound)) {
          if (xbound[b] === null) {
            xbound[b] = i[mode];
          } else {
            if (i[mode] > xbound[b] && b === 'xMax') {
              xbound[b] = i[mode];
            }
            if (i[mode] < xbound[b] && b === 'xMin') {
              xbound[b] = i[mode];
            }
          }
        }
        for (const b of Object.keys(ybound)) {
          if (ybound[b] === null) {
            ybound[b] = i.Intensity;
          } else {
            if (i.Intensity > ybound[b] && b === 'yMax') {
              ybound[b] = i.Intensity;
            }
            if (i.Intensity < ybound[b] && b === 'yMin') {
              ybound[b] = i.Intensity;
            }
          }
        }
      }
    } else {
      console.error('X axis must be RT or MZ');
    }
    return {x: xbound, y: ybound};
  }

  DefineDrag(d3: D3) {
    const drag = d3.drag().on('drag', function (d) {
      console.log(d3.event);
      const circle = d3.select(d3.event.currentTarget).select('circle').attr('x', d3.event.x).attr('y', d3.event.y);
      console.log(circle);
      const text = d3.select(d3.event.currentTarget).select('text').attr('x', d3.event.x).attr('y', d3.event.y - 5);
    });
    return drag;
  }


}
