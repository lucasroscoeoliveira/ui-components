import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { fromEvent, filter, debounceTime, distinctUntilChanged, tap } from 'rxjs';

@Component({
    selector: 'ps-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {
    @Output() public onChanged = new EventEmitter();
    @Input() public text: string = '';
    @Input() public placeholder: string = '';
    @Input() public disabled: boolean = false;
    public searchText: string = '';
    public focus: boolean = false;
    public isHovered: boolean = false;

    @ViewChild('inputSearch') input?: ElementRef = undefined;

    public constructor() {}

    public ngOnInit(): void {
        if (this.disabled) this.clearText();
    }

    public ngAfterViewInit(): any {
        fromEvent(this.input?.nativeElement, 'input')
            .pipe(
                filter(Boolean),
                debounceTime(400),
                distinctUntilChanged(),
                tap(() => {
                    this.onSearchTextChanged(this.searchText);
                    return true;
                })
            )
            .subscribe();
    }

    public setFocus(focus: boolean): boolean {
        if (this.disabled) return false;
        this.focus = focus;
        return true
    }

    public onSearchTextChanged(searchText: string): boolean {
        if (this.disabled) return false;
        this.onChanged.emit(searchText);
        return true;
    }

    public clearText(): boolean {
        if (this.disabled) return false;
        this.searchText = '';
        this.onChanged.emit(this.searchText);
        return true;
    }
}
