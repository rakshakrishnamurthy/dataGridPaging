import * as React from 'react';
import { DataGridSharedData } from './DataGridSharedData';
import { IgrDataGrid, IgrTemplateColumn } from 'igniteui-react-grids';
import { IgrDataGridModule, IgrTemplateCellUpdatingEventArgs } from 'igniteui-react-grids';
import { IgrTextColumn } from 'igniteui-react-grids';
import { DataGridPager } from './DataGridPager';
import { IgrGridColumnOptionsModule, IgrTemplateCellInfo } from 'igniteui-react-grids';
import { ColumnResizingMode } from 'igniteui-react-grids';
import { ColumnResizingAnimationMode } from 'igniteui-react-grids';
import MaleImage from '../src/images/Male.png'
import FemaleImage from '../src/images/Female.png'
import Germany from '../src/images/Germany.png'
import Canada from '../src/images/Canada.png'
import India from '../src/images/India.png'
import France from '../src/images/France.png'
import './DataGridPager.css';
import { FilterFactory } from 'igniteui-react-core';
import { FilterExpression } from 'igniteui-react-core';

IgrDataGridModule.register();
IgrGridColumnOptionsModule.register();

export default class DataGridRowPaging extends React.Component<any, any> {

    private data: any[];
    private grid: IgrDataGrid;
    private pager: DataGridPager;
    public filterFactory: FilterFactory;

    constructor(props: any) {
        super(props);
        this.onGridRef = this.onGridRef.bind(this);
        this.onPagerRef = this.onPagerRef.bind(this);
        this.data = DataGridSharedData.getEmployees();
        console.log(this.data);
    }

    public onGridRef(grid: IgrDataGrid) {
        if (!grid) { return; }

        this.grid = grid;
    }
    public onPagerRef(pager: DataGridPager) {
        if (!pager) { return; }

        this.pager = pager;

        if (this.grid) {
            if (this.grid.sortDescriptions.count > 0) {
                this.onSortChanged();
            }
            if (this.grid.filterExpressions.size() > 0) {
                this.onFilterChanged();
            }
        }
    }

    applyFilter() {
        this.grid.filterExpressions.clear();

        this.filterFactory = new FilterFactory();
        const expression = this.props.searchText.toUpperCase();
        const column = this.filterFactory.property("Name").toUpper();

        let filter: FilterExpression;
        filter = column.contains(expression);
        this.grid.filterExpressions.add(filter);
    }

    public componentDidUpdate(previousProps: any) {
        if (previousProps.searchText !== this.props.searchText) {
            this.applyFilter();
        }
    }

    public render(): JSX.Element {
        return (
            <div className="igContainer ">

                <IgrDataGrid
                    ref={this.onGridRef}
                    width="100%"
                    height="calc(100% - 65px)"
                    autoGenerateColumns={false}
                    columnResizingAnimationMode={ColumnResizingAnimationMode.Interpolate}
                    columnResizingMode={ColumnResizingMode.Deferred}
                    columnResizingSeparatorWidth={4}
                    sortDescriptionsChanged={this.onSortChanged}
                    filterExpressionsChanged={this.onFilterChanged}
                    isColumnOptionsEnabled="true">
                    <IgrTextColumn field="ID" headerText="Customer ID" width="*>90" isEditable="false" />
                    <IgrTextColumn field="Name" headerText="Full Name" width="*>90" />
                    <IgrTemplateColumn field="Country" headerText="Country" cellUpdating={this.countrySelection} width="*>90" isEditable="false" />
                    <IgrTemplateColumn field="Gender" headerText="Gender" cellUpdating={this.genderSelection}></IgrTemplateColumn>
                </IgrDataGrid>

                <DataGridPager
                    ref={this.onPagerRef}
                    dataSource={this.data}
                    pageSize={10}
                    pagedChanged={this.onPageChanged} />

            </div>
        );
    }

    private getImageSrcByItem(item: string) {
        var src = "";

        switch (item) {
            case 'Germany': {
                src = Germany
                break;
            }
            case 'France': {
                src = France
                break;
            }
            case 'Canada': {
                src = Canada
                break;
            }
            default: {
                src = India
                break;
            }
        }

        return src;
    }

    public countrySelection = (s: IgrTemplateColumn, e: IgrTemplateCellUpdatingEventArgs) => {
        const content = e.content as HTMLDivElement;
        const info = e.cellInfo as IgrTemplateCellInfo;
        const item = info.rowItem.Country;
        let space;
        let image;

        if (content.childElementCount === 0) {
            image = document.createElement('img');
            space = document.createElement('span')
            space.textContent = " " + item;
            image.src = this.getImageSrcByItem(item);
            content.appendChild(image);
            content.appendChild(space);
        }
        else {
            image = content.children[0] as HTMLImageElement;
            space = content.children[1] as HTMLSpanElement;
            image.src = this.getImageSrcByItem(item);
            space.textContent = " " + item;
        }
    }

    public genderSelection(s: IgrTemplateColumn, e: IgrTemplateCellUpdatingEventArgs) {
        const content = e.content as HTMLDivElement;
        const info = e.cellInfo as IgrTemplateCellInfo;
        const item = info.rowItem.Gender;
        let image;

        if (content.childElementCount === 0) {
            image = document.createElement('img');
            image.src = item == "Male" ? MaleImage : FemaleImage;
            content.appendChild(image);
        }
        else {
            image = content.children[0] as HTMLImageElement;
            image.src = item == "Male" ? MaleImage : FemaleImage;
        }
    }

    private onSortChanged = () => {
        if (this.pager) {
            this.pager.applySorts(this.grid.sortDescriptions);
        }
    }
    private onFilterChanged = () => {
        if (this.pager) {
            this.pager.applyFilters(this.grid.filterExpressions);
        }
    }
    private onPageChanged = (pageNumber: number, data: any[]) => {
        this.grid.dataSource = data;
        this.grid.flush();
        this.grid.scrollToRowByIndex(0);
    };
}

