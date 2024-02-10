import { Component, ElementRef, ViewChild } from '@angular/core';
import { MapService } from '../core/services';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent {
  title = 'map-component';
  hovered: string | null = null;
  countryInfo: any | null = null;

  constructor(private mapService: MapService) {
    this.test(); // test api call
  }

  @ViewChild('worldMap', { static: false })
  worldMap!: ElementRef<SVGSVGElement>;

  ngAfterViewInit() {
    this.initEventListener();
  }

  initEventListener() {
    const svgElement = this.worldMap.nativeElement;
    const pathElements = svgElement.querySelectorAll('path');
    pathElements.forEach((path) => {
      const pathId = path.getAttribute('id');

      if (!pathId) {
        return; // Skip paths without valid IDs
      }
      path.addEventListener('mouseout', (event) => this.onMouseOut(event));
      path.addEventListener('click', (event) => this.onClick(event));
      path.addEventListener('mouseover', (event) => this.onHoverMouse(event));
    });
  }
  test() {
    const countryId = 'AW'; // test that should return
    this.mapService.getById(countryId).subscribe(
      (response) => {
        console.log('country info: ', response);
      },
      (error) => {
        console.error('error fetching country', error);
      }
    );
  }

  onHoverMouse(e: MouseEvent) {
    const target = e.target as SVGPathElement;
    const pathId = target.getAttribute('id');

    if (!pathId) {
      console.log('Path ID is null, skipping API call.');
      return;
    }

    this.mapService.getById(pathId).subscribe(
      (response) => {
        if (response.length > 1) {
          const countryName = response[1][0].name;
          this.hovered = countryName;
        } else {
          this.hovered = null;
        }
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  onMouseOut(e: MouseEvent) {
    this.hovered = null;
    e.preventDefault();
  }

  onClick(e: MouseEvent) {
    const target = e.target as SVGPathElement;
    const pathId = target.getAttribute('id');

    if (!pathId) {
      console.log('path id is null');
      return;
    }

    this.mapService.getById(pathId).subscribe(
      (response) => {
        if (response.length > 1) {
          console.log('onClick response: ', response);
          this.countryInfo = response[1][0];
        } else {
          this.countryInfo = null;
        }
      },
      (error) => {
        console.error('onClick: data: ', error);
      }
    );
  }
}
