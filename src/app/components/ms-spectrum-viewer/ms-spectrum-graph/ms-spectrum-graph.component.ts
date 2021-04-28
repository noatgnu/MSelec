import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription} from 'rxjs';
import {D3, D3Service} from 'd3-ng2-service';
import {MsDataService} from '../../../helper/ms-data.service';

@Component({
  selector: 'app-ms-spectrum-graph',
  templateUrl: './ms-spectrum-graph.component.html',
  styleUrls: ['./ms-spectrum-graph.component.scss']
})
export class MsSpectrumGraphComponent implements OnInit, OnDestroy {
  @Output() svgOut = new EventEmitter();
  data: Subscription;
  saveTrigger: Subscription;
  private allowedX = ['RT', 'MZ'];
  private parentNativeEnviroment: any;
  private d3Obj: D3;
  private svg;
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
    this.saveTrigger = this.spectrum.saveTriggerReader.subscribe((data) => {
      if (data === true) {
        this.exportSvg();
      }
    });

    this.data = this.spectrum.viewerDataReader.subscribe((data) => {
      console.log(data);
      let mode;
      if (data.Options !== null) {
        mode = data.Options['mode'];
      } else {
        mode = 'MZ';
      }
      const d3Local = this.d3Obj;
      const frame = {width: 1820, height: 450};
      const margin = {top: 20, right: 20, bottom: 60, left: 80};
      const width = frame.width - margin.left - margin.right;
      const height = frame.height - margin.top - margin.bottom;
      const bound = this.GetXYBound(mode, data);
      const spectrumService = this.spectrum;
      let previewLineHorizontal;
      let previewLineVertical;
      let svg: any;

      if (this.parentNativeEnviroment != null) {
        if (this.svg === undefined) {
          this.svg = d3Local.select(this.parentNativeEnviroment).append('svg')
            //.attr('width', frame.width).attr('height', frame.height)
            .attr('viewBox', '0 0 1820 450');
          svg = this.svg;
        } else {
          svg = d3Local.select(this.parentNativeEnviroment).select('svg');
          svg.select('*').remove();
        }

        // .attr('width', frame.width).attr('height', frame.height);

        const x = spectrumService.GetXAxis(d3Local, width, bound.x.xMax + bound.x.xMax / 6);
        const xAxis = d3Local.axisBottom(x);
        const y = spectrumService.GetYAxis(d3Local, height, bound.y.yMax + bound.y.yMax / 3);
        const yAxis = d3Local.axisLeft(y);

        const graphBlock = svg.append('g').attr('class', 'graphBlock').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
        const backgroundBlock = graphBlock.append('g').attr('class', 'background');
        const background = backgroundBlock.append('rect').attr('width', width).attr('height', height);
        // .style('fill', 'transparent')
        // .style('stroke', 'black')
        // .style('stroke-width', 0.5);

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

        const peaks = graphBlock.selectAll('.peaks').data(data.Values);
        const peakBlocks = peaks.enter().append('g').attr('class', 'peak-block');
        const peak = peakBlocks.append('line').attr('class', function (d) {
          return 'peak ' + d.IonType + '-ion';
        })
          .attr('x1', function (d) {
            return x(d[mode]);
          }).attr('x2', function (d) {
            return x(d[mode]);
          }).attr('y1', function() {
            console.log(y(0));
            return y(0);
          })
          .attr('y2', y(0));
        console.log(peak);
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
        const peakLabelText = peakLabelBlock.append('text').attr('class', 'label-text').attr('dy', '1em')
          .attr('transform', function (d) {
            return 'translate(' + x(d[mode]) + ',' + (y(0) - 12) + ') rotate(-90)';
          })
          /*.attr('x', function (d) {
            return x(d[mode]);
          }).attr('y', y(0) - 12)*/
          .text(function (d) {
            return Math.round(d.MZ * 10000) / 10000;
          });

        peak.transition().duration(1000).attr('y2', function (d) {
          return y(d.Intensity);
        });
        peakLabelPoint.transition().duration(1000).attr('cy', function (d) {
          return y(d.Intensity) - 7;
        });
        peakLabelText.transition().duration(1000)
          .attr('transform', function (d) {
            return 'translate(' + x(d[mode]) + ',' + (y(d.Intensity) - 12) + ') rotate(-90)';
          })
          /*.attr('y', function (d) {
          return y(d.Intensity) - 12;
        })*/;


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
        const yAxisTitle = graphBlock.append('g').attr('class', 'left-axis-title')
          .append('text').attr('transform', 'rotate(-90)').attr('y', 0 - margin.left)
          .attr('x', 0 - (height / 2)).attr('dy', '1em').style('text-anchor', 'middle').text('Intensity');
        const xAxisTitle = graphBlock.append('g').attr('class', 'bottom-axis-title')
          .append('text').attr('transform', 'translate(' + (width / 2) + ' ,' + (height + margin.top * 2) + ')').style('text-anchor', 'middle').text(mode);
        // peakBlocks.exit().remove();
        // const a = graphBlock.append('g').attr('class', 'brush').call(brush);
        // console.log(a);
        svg.exit();
      }
    });

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
        const text = parent.select('text')
          .attr('transform', function () {
            return 'translate(' + d3Local.event.x + ',' + (d3Local.event.y - 5) + ') rotate(-90)';
          });
          // .attr('x', d3Local.event.x).attr('y', d3Local.event.y - 5);
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

  ngOnDestroy() {
    this.data.unsubscribe();
    this.saveTrigger.unsubscribe();
  }

  GetXYBound(mode: string, data) {
    const xbound = {xMin: null, xMax: null};
    const ybound = {yMin: null, yMax: null};

    if (this.allowedX.includes(mode)) {
      for (const i of data.Values) {
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

  exportSvg() {
    if (this.svg !== undefined) {
      const a = new XMLSerializer();
      const svgDocType = document.implementation.createDocumentType('svg',  '-//W3C//DTD SVG 1.1//EN', 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd');
      const svgDoc = document.implementation.createDocument ('http://www.w3.org/2000/svg', 'svg', svgDocType);
      const newDoc = this.svg.node().cloneNode(true);
      this.read_Element(newDoc, this.svg.node());
      svgDoc.replaceChild(newDoc, svgDoc.documentElement);

      this.svgOut.emit(a.serializeToString(svgDoc));
    }
  }

  read_Element(ParentNode, OrigData) {
    const Children = ParentNode.childNodes;
    const OrigChildDat = OrigData.childNodes;
    const ContainerElements = ['svg', 'g'];
    const RelevantStyles = {'rect': ['fill', 'stroke', 'stroke-width'], 'path': ['fill', 'stroke', 'stroke-width'], 'circle': ['fill', 'stroke', 'stroke-width'], 'line': ['stroke', 'stroke-width'], 'text': ['fill', 'font-size', 'text-anchor', 'font-family'], 'polygon': ['stroke', 'fill']};

    for (let cd = 0; cd < Children.length; cd++) {
      const Child = Children[cd];

      const TagName = Child.tagName;
      if (ContainerElements.indexOf(TagName) !== -1) {
        this.read_Element(Child, OrigChildDat[cd]);
      } else {
        const StyleDef = window.getComputedStyle(OrigChildDat[cd], null);
        console.log(StyleDef.getPropertyValue('fill'));
        let StyleString = '';
        for (let st = 0; st < RelevantStyles[TagName].length; st++) {
          StyleString += RelevantStyles[TagName][st] + ':' + StyleDef[RelevantStyles[TagName][st]] + '; ';
        }

        Child.setAttribute('style', StyleString);
      }
    }
  }

  getSVGString( svgNode ) {
    svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
    const cssStyleText = getCSSStyles( svgNode );
    appendCSS( cssStyleText, svgNode );

    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svgNode);
    svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
    svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix

    return svgString;

    function getCSSStyles( parentElement ) {
      const selectorTextArr = [];

      // Add Parent element Id and Classes to the list
      selectorTextArr.push( '#' + parentElement.id );
      for (let c = 0; c < parentElement.classList.length; c++) {
        if ( !contains('.' + parentElement.classList[c], selectorTextArr) ) {
          selectorTextArr.push( '.' + parentElement.classList[c] );
        }
      }

      // Add Children element Ids and Classes to the list
      const nodes = parentElement.getElementsByTagName('*');
      for (let i = 0; i < nodes.length; i++) {
        const id = nodes[i].id;
        if ( !contains('#' + id, selectorTextArr) ) {
          selectorTextArr.push( '#' + id );
        }

        const classes = nodes[i].classList;
        for (let c = 0; c < classes.length; c++) {
          if ( !contains('.' + classes[c], selectorTextArr) ) {
            selectorTextArr.push( '.' + classes[c] );
          }
        }
      }

      // Extract CSS Rules
      let extractedCSSText = '';
      for (let i = 0; i < document.styleSheets.length; i++) {
        const s = <CSSStyleSheet>document.styleSheets[i];

        try {
          if (!s.cssRules) { continue; }
        } catch ( e ) {
          if (e.name !== 'SecurityError') { throw e; } // for Firefox
          continue;
        }

        const cssRules = s.cssRules;
        for (let r = 0; r < cssRules.length; r++) {
          if ( contains( (<CSSStyleRule>cssRules[r]).selectorText, selectorTextArr ) ) {
            extractedCSSText += cssRules[r].cssText;
          }
        }
      }


      return extractedCSSText;

      function contains(str, arr) {
        return arr.indexOf( str ) === -1 ? false : true;
      }

    }

    function appendCSS( cssText, element ) {
      const styleElement = document.createElement('style');
      styleElement.setAttribute('type', 'text/css');
      styleElement.innerHTML = cssText;
      const refNode = element.hasChildNodes() ? element.children[0] : null;
      element.insertBefore( styleElement, refNode );
    }
  }
}
