import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-date-picker';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { formatDate, parseDate } from 'react-day-picker/moment';

import { SingleInput } from '../index.js';
import DatePickerYearMonth from './datePickerYearMonth.js';
const modifiers = {
  disabled: { daysOfWeek: [6] },
  birthday: new Date(2018, 8, 19),
  monday: { daysOfWeek: [1] }
};
const currentYear = new Date().getFullYear();
const fromMonth = new Date(currentYear, 0);
const toMonth = new Date(currentYear + 10, 11);

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      month: fromMonth
    };
    this.handleYearMonthChange = this.handleYearMonthChange.bind(this);
    this.onSearchFieldChange = this.onSearchFieldChange.bind(this);
    this.onSearchTypeAheadChange = this.onSearchTypeAheadChange.bind(this);
    this.onSearchTypeAheadOnBlur = this.onSearchTypeAheadOnBlur.bind(this);
  }

  onSearchFieldChange = event => {
    const {
      searchFields,
      onSearchFieldUpdate,
      onSearchGroupUpdate,
      searchGroups
    } = this.props;

    const thisIndex = searchGroups.findIndex(
      item => item.field === event.target.name
    );
    if (thisIndex >= 0) {
      searchGroups[thisIndex].value = event.target.value || '';

      onSearchGroupUpdate(searchGroups);
    } else {
      const thisIndex = searchFields.findIndex(
        item => item.field === event.target.name
      );
      if (thisIndex >= 0) {
        searchFields[thisIndex].value = event.target.value;
        onSearchFieldUpdate(searchFields);
      }
    }
  };

  onSearchDateChange(date, field) {
    const { searchFields, onSearchFieldUpdate } = this.props;
    const thisIndex = searchFields.findIndex(item => item.field === field);
    if (thisIndex > 0) {
      searchFields[thisIndex].value = date || '';
    }
    onSearchFieldUpdate(searchFields);
  }

  onSearchTypeAheadChange(gvalue, field) {
    const valueIs = (gvalue && gvalue.length > 0 && gvalue[0].value) || '';
    const {
      searchFields,
      onSearchGroupUpdate,
      searchGroups,
      onSearchFieldUpdate,
      onSearchFactoryGrpApi
    } = this.props;
    const thisIndex = searchGroups.findIndex(item => item.field === field);
    if (thisIndex >= 0) {
      //searchGroups[thisIndex].value = valueIs || '';
      searchGroups[thisIndex].selected = gvalue;
      if (searchGroups[thisIndex].field === 'factoryGroup') {
        const i = searchGroups.findIndex(o => o.field === 'factoryCode');
        if (valueIs) {
          const factGrpOpts = searchGroups[thisIndex].options;
          let newFaCodes =
            factGrpOpts.find(o => o.value === valueIs).factoryCodes || [];
          searchGroups[i].options = newFaCodes;
        } else {
          searchGroups[i].options = searchGroups[i].backOptions;
        }
        searchGroups[i].value = '';
        searchGroups[i].selected = [];
        let thisrel = this.refs[`typeAheadfactoryCode`];
        if (thisrel) {
          thisrel.getInstance().clear();
        }
      }
      searchFields.forEach(gridItem => {
        if (gridItem.field === 'capacityTypeCode') {
          gridItem.value = '';
          gridItem.selected = [];
          let thisrel = this.refs[`typeAhead${gridItem.field}`];
          if (thisrel) {
            thisrel.getInstance().clear();
          }
        }
      });
      onSearchGroupUpdate(searchGroups);
      onSearchFactoryGrpApi();
    } else {
      const thisIndex = searchFields.findIndex(item => item.field === field);
      if (thisIndex >= 0) {
        searchFields[thisIndex].selected = gvalue;
        searchFields[thisIndex].value = valueIs || '';
      }
    }
    onSearchFieldUpdate(searchFields);
  }

  getInstanceValue(object, instance) {
    if (
      instance &&
      instance.getInstance().getInput() &&
      instance.getInstance().getInput().value
    ) {
      return (
        instance
          .getInstance()
          .getInput()
          .value.toUpperCase() || ''
      );
    }
    return '';
  }
  onSearchTypeAheadOnBlur(field) {
    const { searchFields, searchGroups, pageType } = this.props;
    const listenBlur = pageType === 'upload' ? false : true;
    if (listenBlur) {
      let thisrelVal = '';
      let thisrelObj = [];
      let selected = false;
      setTimeout(() => {
        const thisIndex = searchGroups.findIndex(item => item.field === field);
        if (thisIndex >= 0) {
          let thisrel = this.refs[`typeAhead${field}`];
          thisrelVal = this.getInstanceValue(searchGroups[thisIndex], thisrel);
          thisrelObj = searchGroups[thisIndex].options.find(
            o => o.name === thisrelVal
          );
          if (searchGroups[thisIndex].selected.length === 0) {
            selected = true;
          }
        } else {
          const thisIndex = searchFields.findIndex(
            item => item.field === field
          );
          if (thisIndex >= 0) {
            let thisrel = this.refs[`typeAhead${field}`];
            thisrelVal = this.getInstanceValue(
              searchFields[thisIndex],
              thisrel
            );
            thisrelObj = searchFields[thisIndex].options.find(
              o => o.name === thisrelVal
            );
            if (searchFields[thisIndex].selected.length === 0) {
              selected = true;
            }
          }
        }
        if (thisrelObj && selected) {
          const ar = [thisrelObj];
          this.onSearchTypeAheadChange(ar, field);
        }
      }, 100);
    }
  }

  onSearchFieldClear(n) {
    const { searchFields, onSearchFieldUpdate } = this.props;
    searchFields.forEach(gridItem => {
      gridItem.value = '';
      gridItem.selected = [];
      let thisrel = this.refs[`typeAhead${gridItem.field}`];
      if (thisrel) {
        thisrel.getInstance().clear();
      }
      if (gridItem.field === 'capacityTypeCode') {
        gridItem.options = [];
        gridItem.disabled = true;
        gridItem.value = '';
      }
    });
    onSearchFieldUpdate(searchFields);
  }
  onSearchAllClear(n) {
    const { searchGroups, onSearchGroupUpdate } = this.props;
    searchGroups.forEach(gridItem => {
      gridItem.value = '';
      gridItem.selected = [];
      let thisrel = this.refs[`typeAhead${gridItem.field}`];
      if (thisrel) {
        thisrel.getInstance().clear();
      }
      if (gridItem.field === 'factoryCode') {
        gridItem.options = gridItem.backOptions;
      }
    });
    onSearchGroupUpdate(searchGroups);
    this.onSearchFieldClear();
  }

  onSearchEnterFn = () => {
    const { onSearchEnter } = this.props;
    onSearchEnter();
  };

  handleYearMonthChange(month) {
    this.setState({ month });
  }
  getSection = (fieldItem, searchType) => {
    const { pageType } = this.props;

    const multipleSelectTypeAhead = pageType === 'upload' ? true : false;

    if (
      fieldItem.type === 'input' ||
      fieldItem.disabled ||
      (fieldItem.options && fieldItem.options.length === 0)
    ) {
      return (
        <SingleInput
          inputType={fieldItem.format || 'text'}
          title={fieldItem.name}
          name={fieldItem.field}
          key={`${fieldItem.id}-${fieldItem.field}`}
          controlFunc={e => this.onSearchFieldChange(e)}
          content={fieldItem.value}
          placeholder={fieldItem.placeholder || ''}
          className={`ncss-col-sm-12 description u-bold trf-data-text border-black ${fieldItem.cssClass}`}
          required={fieldItem.required || false}
          disabled={true}
        />
      );
    }
    switch (fieldItem.type) {
      case 'options':
        return (
          <div>
            {fieldItem.name}{' '}
            {fieldItem.required ? (
              <span style={{ color: 'red' }}>*</span>
            ) : null}
            <br />
            <select
              name={fieldItem.field}
              value={fieldItem.value}
              key={`${fieldItem.id}-${fieldItem.field}`}
              onChange={e => this.onSearchFieldChange(e)}
              className={`ncss-col-sm-12 p1-sm border-black bg-white no-border-custom  ${fieldItem.cssClass}`}
              disabled={fieldItem.disabled}
            >
              <option />
              {fieldItem.options &&
                fieldItem.options.map(v => (
                  <option key={v.key} value={v.value}>
                    {v.label}
                  </option>
                ))}
            </select>
          </div>
        );

      case 'typeahead':
        return (
          <div>
            {fieldItem.name}
            {fieldItem.required ? (
              <span style={{ color: 'red' }}>*</span>
            ) : null}
            <br /> {/**caseSensitive,allowNew  ,newSelectionPrefix=""*/}
            <Typeahead
              value={fieldItem.value}
              id={fieldItem.name}
              ref={`typeAhead${fieldItem.field}`}
              onChange={value =>
                this.onSearchTypeAheadChange(value, fieldItem.field)
              }
              maxSelected={1}
              onBlur={() => this.onSearchTypeAheadOnBlur(fieldItem.field)}
              options={
                fieldItem.selected.length >= fieldItem.maxLimit
                  ? []
                  : fieldItem.options
              }
              placeholder={fieldItem.placeholder || ''}
              disabled={fieldItem.disabled}
              multiple={multipleSelectTypeAhead}
              selected={fieldItem.selected}
            />
          </div>
        );

      case 'date':
        return (
          <div>
            {fieldItem.name}
            <br />
            <div className={`DayPicker-Border ${fieldItem.cssClass}`}>
              <DayPickerInput
                value={fieldItem.value}
                onDayChange={day =>
                  this.onSearchDateChange(day, fieldItem.field)
                }
                modifiers={modifiers}
                formatDate={formatDate}
                parseDate={parseDate}
                placeholder="MM/DD/YYYY"
                disabledDays={[new Date(2017, 3, 12), { daysOfWeek: [0, 6] }]}
                inputProps={{ readOnly: true }}
                disabled={fieldItem.disabled}
                dayPickerProps={{
                  month: this.state.month,
                  fromMonth: fromMonth,
                  toMonth: toMonth,
                  disabledDays: { daysOfWeek: [0, 2, 3, 4, 5, 6] },

                  modifiers,
                  captionElement: ({ date, localeUtils }) => (
                    <DatePickerYearMonth
                      date={date}
                      localeUtils={localeUtils}
                      onChange={this.handleYearMonthChange}
                    />
                  )
                }}
              />
            </div>
          </div>
        );
      case 'dateold':
        return (
          <div>
            {fieldItem.name}
            <br />

            <DatePicker
              value={fieldItem.value}
              key={`${fieldItem.id}-${fieldItem.field}`}
              format={fieldItem.format}
              className={fieldItem.cssClass}
              onChange={date => this.onSearchDateChange(date, fieldItem.field)}
              style={{ width: 'inherit' }}
              disabled={fieldItem.disabled}
            />
          </div>
        );
      default:
    }
  };
  removeAllFromOptions = arr => {
    const arrNew = [...arr];
    arrNew.forEach(item => {
      if (item.options) {
        const foundIndex = item.options.findIndex(i => i.name === 'ALL');
        if (foundIndex >= 0) {
          item.options.splice(foundIndex, 1);
        }
      }
      if (item.backOptions) {
        const foundIndex = item.backOptions.findIndex(i => i.name === 'ALL');
        if (foundIndex >= 0) {
          item.options.splice(foundIndex, 1);
        }
      }
    });
    return arrNew;
  };

  render() {
    const {
      searchFields,
      searchGroups,
      pageType,
      isToggleOn,
      onToggleClick
    } = this.props;
    const searchG =
      pageType === 'upload'
        ? this.removeAllFromOptions(searchGroups)
        : searchGroups;
    const searchF =
      pageType === 'upload'
        ? this.removeAllFromOptions(searchFields)
        : searchFields;

    return (
      <div className="u-full-width fs14-sm lh16-sm u-bold text-color-grey fl-sm-l  ta-sm-c p3-sm pb-1-sm border-light-grey bg-white">
        <form
          onSubmit={e => {
            e.preventDefault();
            this.onSearchEnterFn();
          }}
        >
          <div className="ncss-container">
            <div className="ncss-row">
              <div className="ncss-col-sm-12 ncss-col-md-12 ncss-col-lg-12 ta-sm-l">
                <div className="ncss-row">
                  {searchG &&
                    searchG.map((fieldItem, index) => (
                      <div
                        className={`ncss-col-sm-12 ncss-col-md-6 ncss-col-lg-3 ta-sm-l va-sm-t ${
                          fieldItem.field
                        }  ${fieldItem.show ? '' : ' d-sm-h d-md-h d-lg-h'} `}
                        key={fieldItem.field}
                      >
                        {fieldItem.show && this.getSection(fieldItem, 1)}
                      </div>
                    ))}
                </div>
                <div className="ncss-row">
                  {searchF &&
                    searchF.map(fieldItem => (
                      <div
                        className={`ncss-col-sm-12 ncss-col-md-6 ncss-col-lg-3 ta-sm-l va-sm-t ${
                          fieldItem.field
                        }  ${fieldItem.show ? '' : ' d-sm-h d-md-h d-lg-h'}`}
                        key={fieldItem.field}
                      >
                        {fieldItem.show && this.getSection(fieldItem, 2)}
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className="ncss-row ">
              {pageType === 'upload' && (
                <div className="ncss-col-sm-12 ncss-col-md-6 ncss-col-lg-3 ta-sm-l va-sm-t fl-sm-l">
                  <div className="day-night-wrapper fl-sm-l">
                    <div className="toggle-wrapp">
                      <span
                        className={`toggle ${isToggleOn ? 'active' : ''}`}
                        onClick={() => onToggleClick()}
                      >
                        <i
                          className={
                            isToggleOn
                              ? 'fas fa-calendar-alt'
                              : 'fas fa-calendar-week'
                          }
                        />
                      </span>{' '}
                    </div>
                  </div>
                  <div className=" summary-toggle  fl-sm-l pt3-sm">
                    {!isToggleOn ? 'Weekly' : 'Quarterly'}
                  </div>
                </div>
              )}
              <div className="ncss-col-sm-12  ncss-col-md-6 ncss-col-lg-6  ta-sm-l pt1-sm fl-sm-l ">
                <button
                  type="submit"
                  className={`fl-sm-l    ${
                    pageType === 'upload'
                      ? 'ncss-btn-accent-dark'
                      : 'ncss-btn-primary-dark '
                  }`}
                >
                  <i className="fas far fa-search" />
                  <span className=""> Search</span>
                </button>
                <button
                  type="button"
                  className="fl-sm-l  ncss-btn-secondary-lite"
                  onClick={() => this.onSearchAllClear()}
                >
                  <i className="far fa-times-circle" />{' '}
                  <span className=""> Clear</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
Search.propTypes = {
  onSearchEnter: PropTypes.func,
  onSearchFactoryGrpApi: PropTypes.func,
  onSearchFieldUpdate: PropTypes.func,
  onSearchGroupUpdate: PropTypes.func,
  searchFields: PropTypes.array,
  searchOptions: PropTypes.any,
  searchGroups: PropTypes.array,
  pageSearch: PropTypes.any,
  pageType: PropTypes.any,
  usrFactGrpSearchData: PropTypes.any
};