/*global angular, console, pdfMake */
/*jslint plusplus: true */

/**
 * @ngdoc function
 * @name controller:DashCtrl
 * @description
 * # DashController
 * Controller for objects used in the dashboard
 */
angular.module('Controllers').controller('FreshmanCtrl', function ($scope, $filter, $ionicLoading, $ionicModal, $ionicPopup, $q, $timeout, ngNotify, items, DataService, DownloadService) {
    'use strict';

    //get data for view
    $scope.items = items;
    $scope.itemslength = Object.keys(items).length;

    $scope.downloadEssay1 = function (id, lastname, firstname) {
        return DownloadService.get(id, 'essay1*', lastname + '.' + firstname + '.essay1');
    };
    $scope.downloadEssay2 = function (id, lastname, firstname) {
        return DownloadService.get(id, 'essay2*', lastname + '.' + firstname + '.essay2');
    };

    var coursework = [],
        employment = [],
        activity = [],
        volunteer = [],
        award = [],
        university = [],
        child = [],
        scholarship = [];

    function putNA(data, acType) {
        //put NAs for all NULL values
        var form = DataService.getApplicationForm(acType),
            i,
            j,
            l,
            k;

        if (form !== undefined) {
            for (i = 0, l = data.length; i < l; i++) {
                for (j = 0, k = form.length; j < k; j++) {
                    if (!data[i].hasOwnProperty(form[j].name)) {
                        data[i][form[j].name] = "N/A";
                    }
                }
            }
        }
        return data;
    }

    // callback for ng-click 'createPdf':
    $scope.createPdf = function (item) {

        //load all list data
        $scope.loadingIndicator = $ionicLoading.show({
            content: 'Downloading data and Creating pdf ...'
        });

        var listPromises = [];
        listPromises.push(DataService.getItemList('coursework', item.id).then(function (returnedData) {
            coursework = putNA(returnedData, 'coursework');
        }));
        listPromises.push(DataService.getItemList('employment', item.id).then(function (returnedData) {
            //employment = returnedData;
            var temp = returnedData;
            if (temp !== undefined) {
                employment = putNA(returnedData, 'employment');
            } else {
                employment = temp;
            }

        }));
        listPromises.push(DataService.getItemList('activity', item.id).then(function (returnedData) {
            activity = returnedData;
            if (activity !== undefined) {
                var i,
                    test;
                //convert long string into short version
                for (i = 0; i < activity.length; i++) {
                    test = angular.fromJson(activity[i].year);
                    if (test[0].checked) {
                        activity[i].FR = 'x';
                    } else {
                        activity[i].FR = ' ';
                    }
                    if (test[1].checked) {
                        activity[i].SO = 'x';
                    } else {
                        activity[i].SO = ' ';
                    }
                    if (test[2].checked) {
                        activity[i].JR = 'x';
                    } else {
                        activity[i].JR = ' ';
                    }
                    if (test[3].checked) {
                        activity[i].SR = 'x';
                    } else {
                        activity[i].SR = ' ';
                    }
                }
            }
            var data = activity;
            activity = putNA(data, 'activity');
        }));
        listPromises.push(DataService.getItemList('volunteer', item.id).then(function (returnedData) {
            //volunteer = returnedData;
            volunteer = putNA(returnedData, 'volunteer');
        }));
        listPromises.push(DataService.getItemList('award', item.id).then(function (returnedData) {
            award = returnedData;
            if (award !== undefined) {
                var i,
                    test;
                //convert long string into short version
                for (i = 0; i < award.length; i++) {
                    test = angular.fromJson(award[i].year);
                    if (test[0].checked) {
                        award[i].FR = 'x';
                    } else {
                        award[i].FR = ' ';
                    }
                    if (test[1].checked) {
                        award[i].SO = 'x';
                    } else {
                        award[i].SO = ' ';
                    }
                    if (test[2].checked) {
                        award[i].JR = 'x';
                    } else {
                        award[i].JR = ' ';
                    }
                    if (test[3].checked) {
                        award[i].SR = 'x';
                    } else {
                        award[i].SR = ' ';
                    }
                }
            }
            var data = award;
            award = putNA(data, 'award');
        }));
        listPromises.push(DataService.getItemList('university', item.id).then(function (returnedData) {
            university = returnedData;
            university.sort(function (a, b) {
                return (a.rank) - (b.rank);
            });
            var i;
            for (i = 0; i < university.length; i++) {
                university[i].rank++;
            }

            if (university.length < 6) {
                for (i = university.length; i < 6; i++) {
                    var newuniversity = {};
                    newuniversity.rank = i + 1;
                    newuniversity.name = '';
                    university.push(newuniversity);
                }
            }
            var data = university;
            university = putNA(data, 'university');
        }));
        listPromises.push(DataService.getItemList('child', item.id).then(function (returnedData) {
            //child = returnedData;
            child = putNA(returnedData, 'child');
        }));
        listPromises.push(DataService.getItemList('scholarship', item.id).then(function (returnedData) {
            scholarship = returnedData;
            var i;
            for (i = 0; i < scholarship.length; i++) {
                if (scholarship[i].applied_received) {
                    scholarship[i].level = 'applied';
                } else {
                    scholarship[i].level = 'received';
                }
            }
            var data = scholarship;
            scholarship = putNA(data, 'scholarship');
        }));

        var default_form = DataService.getApplicationForm('application'),
            i,
            l,
            docDefinition;

        //TODO use filter
        //clean data
        if (item.citizen !== undefined) {
            if (item.citizen === 'true') {
                item.citizen = 'Yes';
                item.permanent_resident = 'N/A';
                item.permanent_resident_card = 'N/A';
            } else {
                item.citizen = 'No';
                if (item.permanent_resident !== undefined) {
                    if (item.permanent_resident === 'true') {
                        item.permanent_resident = 'Yes';
                        if (item.permanent_resident_card !== undefined) {
                            if (item.permanent_resident_card) {
                                item.permanent_resident_card = '1551';
                            } else {
                                item.permanent_resident_card = '1551C';
                            }
                        }
                    } else {
                        item.permanent_resident = 'No';
                    }
                }
            }
        }

        if (item.texas_resident !== undefined) {
            if (item.texas_resident === 'true') {
                item.texas_resident = 'Yes';
            } else {
                item.texas_resident = 'No';
            }
        }

        if (item.first_graduate !== undefined) {
            if (item.first_graduate === 'true') {
                item.first_graduate = 'Yes';
            } else {
                item.first_graduate = 'No';
            }
        }

        if (item.texas_tomorrow_fund !== undefined) {
            if (item.texas_tomorrow_fund === 'true') {
                item.texas_tomorrow_fund = 'Yes';
            } else {
                item.texas_tomorrow_fund = 'No';
            }
        }

        //put NAs for all NULL values
        for (i = 0, l = default_form.length; i < l; i++) {
            if (!item.hasOwnProperty(default_form[i].name)) {
                item[default_form[i].name] = "N/A";
            }
        }

        //after loading individual lists, we are ready to create the actual pdf
        $q.all(listPromises).then(function () {
            //define font to use in pdf
            pdfMake.fonts = {
                TimesNewRoman: {
                    normal: 'Times-New-Roman-Regular.ttf',
                    bold: 'Times-New-Roman-Bold.ttf',
                    italics: 'Times-New-Roman-Italic.ttf',
                    bolditalics: 'Times-New-Roman-Bold-Italic.ttf'
                }
            };

            var docDefinition = createDocument(item);

            $timeout(function () {
                $ionicLoading.hide();
            }, 200);
            try {
                pdfMake.createPdf(docDefinition).open();
                //pdfMake.createPdf(docDefinition).download('optionalName.pdf');
            } catch (err) {
                console.log(err);
            }
        });
    };

    //support functions for pdf creation
    function buildTableBody(data, columns, headers, emptyRows) {
        var body = [],
            i,
            j,
            headerRow = [];

        for (i = 0; i < headers.length; i++) {
            headerRow.push({
                text: headers[i],
                fillColor: 'lightgrey'
            });
        }

        // body.push(headers);
        body.push(headerRow);

        if (emptyRows === undefined) {
            emptyRows = 3;
        }

        if (data !== undefined) {

            data.forEach(function (row) {
                var dataRow = [];

                columns.forEach(function (column) {
                    dataRow.push(row[column].toString());
                });

                body.push(dataRow);
            });

            emptyRows = emptyRows - data.length;
            if (emptyRows < 0) {
                emptyRows = 0;
            }
        }


        for (i = 0; i < emptyRows; i++) {
            var dataRow = [];
            for (j = 0; j < columns.length; j++) {
                dataRow.push(' ');
            }

            body.push(dataRow);
        }

        return body;
    }

    //support functions for pdf creation
    function buildTableWidth(widths) {
        var width = [],
            i;

        for (i = 0; i < widths.length; i++) {
            width.push(widths[i]);
        }

        return width;
    }

    //support functions for pdf creation
    function table(data, columns, headers, widths, emptyRows, filter) {
        if (filter !== undefined) {
            data = $filter('filter')(data, {
                level: filter
            }, true);
        }
        return {
            table: {
                widths: buildTableWidth(widths),
                margin: [10, 10, 10, 10],
                headerRows: 1,
                body: buildTableBody(data, columns, headers, emptyRows),
                layout: {
                    hLineWidth: function (i, node) {
                        return (i === 0 || i === node.table.body.length) ? 2 : 1;
                    },
                    vLineWidth: function (i, node) {
                        return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                    },
                    hLineColor: function (i, node) {
                        return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
                    },
                    vLineColor: function (i, node) {
                        return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
                    }

                    // paddingLeft: function(i, node) { return 4; },
                    // paddingRight: function(i, node) { return 4; },
                    // paddingTop: function(i, node) { return 2; },
                    // paddingBottom: function(i, node) { return 2; }
                }
            }
        };
    }

    function createDocument(item) {
        return {
            styles: {
                header: {
                    margin: [40, 30, 40, 10],
                    fontSize: 10
                },
                title: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 0, 0, 0],
                    alignment: 'center'
                },
                subtitle: {
                    fontSize: 14,
                    bold: true,
                    margin: [0, 0, 0, 10],
                    alignment: 'center'
                },
                chapterheader: {
                    fontSize: 12,
                    bold: true,
                    margin: [0, 10, 0, 10]
                },
                sub: {
                    bold: true,
                    margin: [0, 10, 0, 5]
                },
                label: {
                    margin: [0, 0, 0, 10]
                },
                field: {
                    decoration: 'underline',
                    margin: [5, 0, 0, 0]
                },
                tableExample: {
                    margin: [0, 5, 0, 15]
                },
                tableHeader: {
                    bold: true,
                    fontSize: 13,
                    color: 'black'
                },
                notes: {
                    italics: true,
                    bold: true,
                    margin: [0, 5, 0, 5]
                },
                notes_small: {
                    fontSize: 10,
                    italics: true,
                    bold: true,
                    margin: [0, 5, 0, 5]
                }
            },
            defaultStyle: {
                font: 'TimesNewRoman'
            },
            header: function (currentPage, pageCount) {
                return {
                    style: 'header',
                    columns: [
                        {
                            text: 'STUDENT NAME:'
                        },
                        {
                            text: [item.first_name, ' ', item.last_name]
                        },
                        {
                            text: 'UH ID:',
                            width: 'auto'
                        },
                        {
                            text: item.uh_id.toString(),
                            style: 'field'
                        },
                        {
                            text: 'Page ' + currentPage.toString(),
                            alignment: 'right'
                        }
                    ]
                };
            },
            footer: {
                margin: [0, 20, 0, 0],
                text: 'The Honors College ~ 212 MD Anderson Library ~ Houston, TX 77204-2001 ~ 713.743.9010',
                alignment: 'center'
            },


            content: [
                {
                    text: 'University of Houston',
                    style: 'title'
                },
                {
                    text: 'Terry Foundation Scholarship Program Application \n 2015-2016',
                    style: 'subtitle'
                },
                {
                    text: 'Fill out each section of the application form completely, taking care to respond to each question in the space provided.  Please type or print all information legibly.',
                    style: 'notes'
                },
                {
                    text: 'I CERTIFY THAT I HAVE READ AND UNDERSTAND THE PRECEEDING PAGE and that the information I am providing is complete and correct to the best of my knowledge.  If my application is accepted, I agree to abide by the policies, rules, and regulations of the Terry Foundation.  I authorize the University of Houston and/or the Terry Foundation to verify the information I have provided.  I further understand that this information will be relied upon by the Terry Foundation in determining my financial eligibility and that the submission of false information is grounds for rejection of my application, and/or withdrawal of an offer of scholarship.',
                    style: 'notes_small'
                },
                {
                    text: 'I. STUDENT INFORMATION',
                    style: 'chapterheader'
                },
                {
                    columns: [
                        {
                            text: 'Legal Name:',
                            style: 'label',
                            width: 'auto'
                        },
                        {
                            text: [item.last_name, ', ', item.first_name, ', ', item.middle_name],
                            alignment: 'center'
                        }
                    ]
                },
                {
                    alignment: 'center',
                    fontSize: 8,
                    text: '(Last, First, Middle)'

                },
                {
                    columns: [
                        {
                            text: 'Preferred Name:',
                            style: 'label',
                            width: 'auto'
                        },
                        {
                            text: [item.preferred_name],
                            style: 'field'

                        },
                        {
                            text: '7-digit-UH ID:',
                            style: 'label',
                            width: 'auto'
                        },
                        {
                            text: [item.uh_id.toString()],
                            style: 'field'
                        },
                        {
                            text: 'SSN:',
                            style: 'label',
                            width: 'auto'
                        },
                        {
                            text: [item.ssn.toString()],
                            style: 'field',
                            width: 'auto'
                        }
                    ]
                },
                {
                    columns: [
                        {
                            text: 'Permanent Address:',
                            style: 'label',
                            width: 'auto'
                        },
                        {
                            text: [item.permanent_address],
                            style: 'field',
                            width: 'auto'
                        }
                    ]
                },
                {
                    columns: [
                        {
                            text: 'City:',
                            style: 'label',
                            width: 'auto'
                        },
                        {
                            text: [item.city],
                            style: 'field'
                        },
                        {
                            text: 'State:',
                            style: 'label',
                            width: 'auto'
                        },
                        {
                            text: [item.state],
                            style: 'field'
                        },
                        {
                            text: 'Zip Code:',
                            style: 'label',
                            width: 'auto'
                        },
                        {
                            text: [item.zip_code.toString()],
                            style: 'field'
                        },
                        {
                            text: 'County:',
                            style: 'label',
                            width: 'auto'
                        },
                        {
                            text: [item.county.toString()],
                            style: 'field',
                            width: 'auto'
                        }
                    ]
                },
                {
                    columns: [
                        {
                            text: 'Home Phone:',
                            style: 'label',
                            width: 'auto'
                        },
                        {
                            text: [item.home_phone.toString()],
                            style: 'field'
                        },
                        {
                            text: 'Alternate/Cell Phone:',
                            style: 'label',
                            width: 'auto'
                        },
                        {
                            text: [item.alt_cell_phone.toString()],
                            style: 'field'
                        }
                    ]
                },
                {
                    columns: [
                        {
                            text: 'Date of Birth:',
                            style: 'label',
                            width: 'auto'
                        },
                        {
                            text: [item.dob],
                            style: 'field'
                        },
                        {
                            text: 'Gender:',
                            style: 'label',
                            width: 'auto'
                        },
                        {
                            text: [item.gender],
                            style: 'field'
                        }
                    ]
                },
                {
                    columns: [
                        {
                            text: 'Email Address (one you access daily):',
                            style: 'label',
                            width: 'auto'
                        },
                        {
                            text: [item.email],
                            style: 'field'
                        }
                    ]
                },
                {
                    columns: [
                        {
                            text: 'U.S.Citizen?',
                            style: 'label',
                            width: 'auto'
                        },
                        {
                            text: [item.citizen],
                            style: 'field'
                        },
                        {
                            text: 'If “NO,” are you a Permanent Resident?',
                            style: 'label',
                            width: 'auto'
                        },
                        {
                            text: [item.permanent_resident],
                            style: 'field'
                        }
                    ]
                },
                {
                    columns: [
                        {
                            text: 'If you are a Permanent Resident, indicate type of card:',
                            style: 'label',
                            width: 'auto'
                        },
                        {
                            text: [item.permanent_resident_card],
                            style: 'field'
                        }
                    ]
                },
                {
                    columns: [
                        {
                            text: 'Texas Resident?',
                            style: 'label',
                            width: 'auto'
                        },
                        {
                            text: [item.texas_resident],
                            style: 'field'
                        },
                        {
                            text: 'Birthplace:',
                            style: 'label',
                            width: 'auto'
                        },
                        {
                            text: [item.birthplace],
                            style: 'field'
                        }
                    ]
                },
                {
                    columns: [
                        {
                            text: 'Ethnic Background: how do you describe yourself?',
                            style: 'label',
                            width: 'auto'
                        },
                        {
                            text: [item.ethnic_background],
                            style: 'field'
                        }
                    ]
                },
                {
                    columns: [
                        {
                            text: 'Anticipated College Major:',
                            style: 'label',
                            width: 'auto'
                        },
                        {
                            text: [item.anticipated_major],
                            style: 'field'
                        }
                    ]
                },
                {
                    text: 'II.  HIGH SCHOOL INFORMATION',
                    style: 'chapterheader'
                },
                {
                    columns: [
                        {
                            text: 'High School Name:',
                            style: 'label',
                            width: 'auto'
                        },
                        {
                            text: [item.highschool_name],
                            style: 'field'
                        },
                        {
                            text: 'High School City/ST:',
                            style: 'label',
                            width: 'auto'
                        },
                        {
                            text: [item.highschool_city],
                            style: 'field'
                        }
                    ]
                },
                {
                    columns: [
                        {
                            text: 'Your High School Counselor:',
                            style: 'label',
                            width: 'auto'
                        },
                        {
                            text: [item.highschool_councelor],
                            style: 'field'
                        },
                        {
                            text: 'School Phone/Ext.:',
                            style: 'label',
                            width: 'auto'
                        },
                        {
                            text: [item.highschool_phone],
                            style: 'field'
                        }
                    ]
                },
                {
                    columns: [
                        {
                            text: 'Your High School Counselor’s Email Address:',
                            style: 'label',
                            width: 'auto'
                        },
                        {
                            text: [item.highschool_councelor_email],
                            style: 'field'
                        }
                    ]
                },
                {
                    columns: [
                        {
                            text: 'High School GPA:',
                            style: 'label',
                            width: 'auto'
                        },
                        {
                            text: [item.highschool_gpa.toString()],
                            style: 'field'
                        },
                        {
                            text: 'Scale:',
                            style: 'label',
                            width: 'auto'
                        },
                        {
                            text: [item.highschool_scale.toString()],
                            style: 'field'
                        },
                        {
                            text: 'Graduation Date:',
                            style: 'label',
                            width: 'auto'
                        },
                        {
                            text: [item.highschool_graduation_date],
                            style: 'field'
                        }
                    ]
                },
                {
                    columns: [
                        {
                            text: 'Class Rank:',
                            style: 'label',
                            width: 'auto'
                        },
                        {
                            text: [item.highschool_rank.toString()],
                            style: 'field',
                            width: 'auto'
                        },
                        {
                            text: ['out of ' + item.highschool_rank_out.toString() + ' students'],
                            style: 'field'
                        }
                    ]
                },
                {
                    columns: [
                        {
                            text: 'Number of students tied for this rank:',
                            style: 'label',
                            width: 'auto'
                        },
                        {
                            text: [item.highschool_rank_tied.toString()],
                            style: 'field',
                            pageBreak: 'after'
                        }
                    ]
                },
                {
                    text: 'II.  HIGH SCHOOL INFORMATION (continued)',
                    style: 'chapterheader'
                },
                {
                    text: 'Test Scores',
                    style: 'sub'
                },

                {
                    table: {
                        widths: [20, 70, 50, 20, 100, 50, 20, 70, 70],
                        headerRows: 0,
                        body: [
                            [
                                {
                                    text: 'PSAT',
                                    bold: 'true'
                                },
                                {
                                    text: 'Verbal:',
                                    alignment: 'right'
                                },
                                {
                                    text: [item.psat_verbal.toString()],
                                    alignment: 'left',
                                    style: 'field'
                                },
                                {
                                    text: 'SAT',
                                    bold: 'true'
                                },
                                {
                                    text: 'Critical Reading:',
                                    alignment: 'right'
                                },
                                {
                                    text: [item.sat_reading.toString()],
                                    alignment: 'left',
                                    style: 'field'
                                },
                                {
                                    text: 'ACT',
                                    bold: 'true',
                                    alignment: 'right'
                                },
                                {
                                    text: 'Composite:',
                                    alignment: 'right'
                                },
                                {
                                    text: [item.act_composite.toString()],
                                    alignment: 'left',
                                    style: 'field'
                                }
                            ],
                            [
                                {
                                    text: ''
                                },
                                {
                                    text: 'Math:',
                                    alignment: 'right'
                                },
                                {
                                    text: [item.psat_math.toString()],
                                    alignment: 'left',
                                    style: 'field'
                                },
                                {
                                    text: ''
                                },
                                {
                                    text: 'Mathematics:',
                                    alignment: 'right'
                                },
                                {
                                    text: [item.sat_math.toString()],
                                    alignment: 'left',
                                    style: 'field'
                                },
                                {
                                    text: ''
                                },
                                {
                                    text: 'Date of Test:',
                                    alignment: 'right'
                                },
                                {
                                    text: [item.act_date],
                                    alignment: 'left',
                                    style: 'field'
                                }
                            ],
                            [
                                {
                                    text: 'Writing Skills:',
                                    alignment: 'right',
                                    colSpan: 2
                                },
                                {
                                    text: [item.psat_writing.toString()],
                                    alignment: 'left',
                                    style: 'field'
                                },
                                {
                                    text: ''
                                },
                                {
                                    text: ''
                                },
                                {
                                    text: 'Writing:',
                                    alignment: 'right'
                                },
                                {
                                    text: [item.sat_writing.toString()],
                                    alignment: 'left',
                                    style: 'field'
                                },
                                {
                                    text: ''
                                },
                                {
                                    text: ''
                                },
                                {
                                    text: ''
                                }
                            ],
                            [
                                {
                                    text: 'Selection Index:',
                                    alignment: 'right',
                                    colSpan: 2
                                },
                                {
                                    text: [item.psat_selection.toString()],
                                    alignment: 'left',
                                    style: 'field'
                                },
                                {
                                    text: ''
                                },
                                {
                                    text: ''
                                },
                                {
                                    text: 'Composite:',
                                    alignment: 'right'
                                },
                                {
                                    text: [item.sat_composite.toString()],
                                    alignment: 'left',
                                    style: 'field'
                                },
                                {
                                    text: ''
                                },
                                {
                                    text: ''
                                },
                                {
                                    text: ''
                                }
                            ],
                            [
                                {
                                    text: 'Date of Test:',
                                    alignment: 'right',
                                    colSpan: 2
                                },
                                {
                                    text: [item.psat_date],
                                    alignment: 'left',
                                    style: 'field'
                                },
                                {
                                    text: ''
                                },
                                {
                                    text: ''
                                },
                                {
                                    text: 'Date of Test:',
                                    alignment: 'right'
                                },
                                {
                                    text: [item.sat_date],
                                    alignment: 'left',
                                    colSpan: 2,
                                    style: 'field'
                                },
                                {
                                    text: ''
                                },
                                {
                                    text: ''
                                },
                                {
                                    text: ''
                                }
                            ]

                        ]
                    },
                    layout: 'noBorders'
                },
                {
                    text: 'Indicate the level of recognition you have achieved in the following scholarship competition(s).',
                    style: 'sub'
                },
                {
                    table: {
                        widths: ['*', '*', '*', '*'],
                        headerRows: 0,
                        body: [
                            [
                                {
                                    text: 'National Merit:'
                                },
                                {
                                    text: [item.national_merit],
                                    alignment: 'left',
                                    style: 'field'
                                },
                                {
                                    text: 'Date:',
                                    alignment: 'right'
                                },
                                {
                                    text: [item.national_merit_date],
                                    alignment: 'left',
                                    style: 'field'
                                }
                            ],
                            [
                                {
                                    text: 'National Achievement:'
                                },
                                {
                                    text: [item.national_achievement],
                                    alignment: 'left',
                                    style: 'field'
                                },
                                {
                                    text: 'Date:',
                                    alignment: 'right'
                                },
                                {
                                    text: [item.national_achievement_date],
                                    alignment: 'left',
                                    style: 'field'
                                }
                            ],
                            [
                                {
                                    text: 'National Hispanic:'
                                },
                                {
                                    text: [item.national_hispanic],
                                    alignment: 'left',
                                    style: 'field'
                                },
                                {
                                    text: 'Date:',
                                    alignment: 'right'
                                },
                                {
                                    text: [item.national_hispanic_date],
                                    alignment: 'left',
                                    style: 'field'
                                }
                            ]
                        ]
                    },
                    layout: 'noBorders'
                },
                {
                    margin: 10,
                    text: ' '
                },
                {
                    text: 'III.	PRE-AP, ADVANCED PLACEMENT (AP), INTERNATIONAL BACCALAUREATE PROGRAM (IB), OR DUAL CREDIT (DC) COURSEWORK TAKEN IN HIGH SCHOOL',
                    style: 'chapterheader'
                },
                table(coursework, ['name', 'type', 'credit_hours', 'final_grade'], ['Sophomore Level Coursework', 'AP/IB/DC', 'Credit Hours', 'Final Grade'], [200, '*', '*', '*'], 3, 'sophomore'),
                table(coursework, ['name', 'type', 'credit_hours', 'final_grade'], ['Junior Level Coursework', 'AP/IB/DC', 'Credit Hours', 'Final Grade'], [200, '*', '*', '*'], 5, 'junior'),
                table(coursework, ['name', 'type', 'credit_hours', 'final_grade'], ['Senior Level Coursework', 'AP/IB/DC', 'Credit Hours', 'Final Grade'], [200, '*', '*', '*'], 7, 'senior'),
                {
                    pageBreak: 'after',
                    text: ''
                },
                {
                    text: [{
                        text: 'For sections IV & V, fill space provided completely.  Do not submit a resume in lieu of completing sections IV & V.',
                        bold: true
                    }, ' Important:  If you are a recruited athlete, DO NOT include any information about your athletic participation or achievements on this application.']
                },
                {
                    text: 'IV.  EMPLOYMENT, ACTIVITIES, SERVICE AND AWARDS',
                    style: 'chapterheader'
                },
                {
                    text: 'Employment, Internships, and Summer Activities',
                    style: 'notes'
                },
                {
                    margin: [0, 0, 0, 5],
                    text: ['List all of your previous and current jobs or internships.  Include your job title, your employer’s name, how many hours per week you worked, and the dates of employment.', {
                        text: ' List your most recent activities first.',
                        bold: true
                    }]
                },
                table(employment, ['position', 'employer', 'hours', 'date_from', 'date_to'], ['Position/Job Title', 'Employer', 'Hours Per Week', 'From:', 'To:'], [100, '*', '*', '*', '*'], 7),
                {
                    text: 'Extracurricular Activities and Leadership Positions',
                    style: 'notes'
                },
                {
                    margin: [0, 0, 0, 5],
                    text: [{
                        text: 'In order of importance to you',
                        bold: true
                    }, ', list your top six extracurricular activities (include band, clubs, affiliations, etc.) and the position(s) you held.']
                },
                table(activity, ['activity', 'position', 'description', 'FR', 'SO', 'JR', 'SR'], ['Organization / Activity', 'Position(s) Held', 'Description of Activity', 'FR', 'SO', 'JR', 'SR'], [120, 100, 150, '*', '*', '*', '*'], 6),
                {
                    text: 'Community or Volunteer Service',
                    style: 'notes'
                },
                {
                    text: 'Describe your role in the organization, the type of organization you were associated with, how many hours of service you devoted each week, and when you participated in each activity.  List your most recent service first.'
                },
                table(volunteer, ['place', 'description', 'hours_week', 'hours_total', 'date_from', 'date_to'], ['Place of Service', 'Description of Service', 'Hours/Week', 'Hours/Total', 'From:', 'To:'], [120, 160, 30, 30, '*', '*'], 6),
                {
                    pageBreak: 'after',
                    text: ''
                },
                {
                    text: 'IV.  EMPLOYMENT, ACTIVITIES, SERVICE AND AWARDS (continued)',
                    style: 'chapterheader'
                },
                {
                    text: 'Awards, Special Honors, and Distinctions',
                    style: 'notes'
                },
                {
                    margin: [0, 0, 0, 5],
                    text: [{
                        text: 'In order of importance to you',
                        bold: true
                    }, ', list up to six major awards, honors, or distinctions that you received both in and out of school during grades 9-12.']
                },
                table(award, ['award', 'description', 'level', 'FR', 'SO', 'JR', 'SR'], ['Award/Distinction/Honor', 'Description/Basis for or Sponsor of Award', 'Level of Competition', 'FR', 'SO', 'JR', 'SR'], [150, 150, 100, '*', '*', '*', '*'], 6),
                {
                    text: 'V.  COLLEGE PLANS',
                    style: 'chapterheader'
                },
                {
                    text: 'Will you be the first in your family to graduate college?',
                    style: 'label'
                },
                {
                    margin: [0, 0, 0, 10],
                    text: [item.first_graduate]

                },
                {
                    text: 'Why have you chosen to apply to the University of Houston?',
                    style: 'label'
                },
                {
                    margin: [0, 0, 0, 10],
                    text: [item.why_apply]
                },
                {
                    margin: [0, 0, 0, 5],
                    text: 'List, in order of preference, the top six colleges or universities you are considering attending (be sure to rank the University of Houston among your choices):',
                    style: 'notes'
                },
                {
                    table: {
                        widths: ['*', '*'],
                        headerRows: 0,
                        body: [
                            [
                                {
                                    text: [university[0].rank.toString(), ' ', university[0].name]
                                },
                                {
                                    text: [university[3].rank.toString(), ' ', university[3].name]
                                }
                            ],
                            [
                                {
                                    text: [university[1].rank.toString(), ' ', university[1].name]
                                },
                                {
                                    text: [university[4].rank.toString(), ' ', university[4].name]
                                }
                            ],
                            [
                                {
                                    text: [university[2].rank.toString(), ' ', university[2].name]
                                },
                                {
                                    text: [university[5].rank.toString(), ' ', university[5].name]
                                }
                            ]
                        ]
                    }
                },
                {
                    margin: [0, 10, 0, 10],
                    text: 'Why have you chosen your academic major(s)?'
                },
                {
                    margin: [0, 0, 0, 10],
                    text: [item.why_major]
                },
                {
                    text: 'Briefly describe any educational plans you have beyond earning your Bachelor’s degree:',
                    style: 'label'
                },
                {
                    margin: [0, 0, 0, 10],
                    text: [item.educational_plans]
                },
                {
                    text: 'What are some of your life’s goals and objectives?',
                    style: 'label'
                },
                {
                    margin: [0, 0, 0, 10],
                    text: [item.life_goals],
                    pageBreak: 'after'
                },
                {
                    text: 'VI.  FINANCIAL INFORMATION',
                    style: 'chapterheader'
                },
                {
                    text: 'To be considered for a Terry Foundation Scholarship, applicants must file a completed Free Application for Federal Student Aid (FAFSA) with the U.S. Department of Education and indicate the University of Houston (school code: 003652) as a report recipient.  FAFSA forms can be submitted on-line after January 1st at www.fafsa.ed.gov.  You must file your FAFSA no later than February 28th. You must complete the FAFSA or your application cannot be processed.'
                },
                {
                    text: 'Please complete all questions or your application cannot be considered.  Financial information may be subject to verification from tax returns or other sources.  ',
                    style: 'notes'
                },
                {
                    table: {
                        widths: ['auto', '*'],
                        headerRows: 0,
                        body: [
                            [
                                {
                                    columns: [
                                        {
                                            text: 'Your marital status:',
                                            width: 'auto',
                                            style: 'label'
                                        },
                                        {
                                            text: [item.marital_status],
                                            alignment: 'left',
                                            style: 'field'
                                        }
                                    ]
                                },
                                {
                                    columns: [
                                        {
                                            text: 'Your parents’ marital status:',
                                            width: 'auto',
                                            style: 'label'
                                        },
                                        {
                                            text: [item.marital_status_parents],
                                            alignment: 'left',
                                            style: 'field'
                                        }
                                    ]
                                }
                            ],
                            [
                                {
                                    columns: [
                                        {
                                            text: 'Your total annual income:',
                                            style: 'label',
                                            width: 'auto'
                                        },
                                        {
                                            text: [item.total_annual_income.toString()],
                                            alignment: 'left',
                                            style: 'field'
                                        }
                                    ]
                                },
                                {
                                    columns: [
                                        {
                                            text: 'You presently live with (name & relationship):',
                                            style: 'label',
                                            width: 'auto'
                                        },
                                        {
                                            text: [item.present_partner],
                                            alignment: 'left',
                                            style: 'field'
                                        }
                                    ]
                                }
                            ]
                        ]
                    },
                    layout: 'noBorders'
                },
                {
                    table: {
                        widths: ['*', '*'],
                        headerRows: 0,
                        body: [
                            [
                                {
                                    columns: [
                                        {
                                            text: 'Father’s occupation:',
                                            style: 'label',
                                            width: 'auto'
                                        },
                                        {
                                            text: [item.father_occupation],
                                            alignment: 'left',
                                            style: 'field'
                                        }
                                    ]
                                },
                                {
                                    columns: [
                                        {
                                            text: 'Step Parent’s occupation:',
                                            style: 'label',
                                            width: 'auto'
                                        },
                                        {
                                            text: [item.stepparent_occupation],
                                            alignment: 'left',
                                            style: 'field'
                                        }
                                    ]
                                }
                            ],
                            [
                                {
                                    columns: [
                                        {
                                            text: 'Father’s employer:',
                                            style: 'label',
                                            width: 'auto'
                                        },
                                        {
                                            text: [item.father_employer],
                                            alignment: 'left',
                                            style: 'field'
                                        }
                                    ]
                                },
                                {
                                    columns: [
                                        {
                                            text: 'Step Parent’s employer:',
                                            style: 'label',
                                            width: 'auto'
                                        },
                                        {
                                            text: [item.stepparent_employer],
                                            alignment: 'left',
                                            style: 'field'
                                        }
                                    ]
                                }
                            ],
                            [
                                {
                                    columns: [
                                        {
                                            text: 'Father’s total annual income:',
                                            style: 'label',
                                            width: 'auto'
                                        },
                                        {
                                            text: [item.father_total_income.toString()],
                                            alignment: 'left',
                                            style: 'field'
                                        }
                                    ]
                                },
                                {
                                    columns: [
                                        {
                                            text: 'Step Parent’s total annual income:',
                                            style: 'label',
                                            width: 'auto'
                                        },
                                        {
                                            text: [item.stepparent_total_income.toString()],
                                            alignment: 'left',
                                            style: 'field'
                                        }
                                    ]
                                }
                            ],
                            [
                                {
                                    columns: [
                                        {
                                            text: 'Father’s age',
                                            style: 'label',
                                            width: 'auto'
                                        },
                                        {
                                            text: [item.father_age.toString()],
                                            alignment: 'left',
                                            style: 'field'
                                        }
                                    ]
                                },
                                {
                                    columns: [
                                        {
                                            text: 'Step Parent’s age:',
                                            style: 'label',
                                            width: 'auto'
                                        },
                                        {
                                            text: [item.stepparent_age.toString()],
                                            alignment: 'left',
                                            style: 'field'
                                        }
                                    ]
                                }
                            ],
                            [
                                {
                                    columns: [
                                        {
                                            text: 'Highest level of education achieved:',
                                            style: 'label',
                                            width: 'auto'
                                        },
                                        {
                                            text: [item.father_level_education],
                                            alignment: 'left',
                                            style: 'field'
                                        }
                                    ]
                                },
                                {
                                    columns: [
                                        {
                                            text: 'Highest level of education achieved:',
                                            style: 'label',
                                            width: 'auto'
                                        },
                                        {
                                            text: [item.stepparent_level_education],
                                            alignment: 'left',
                                            style: 'field'
                                        }
                                    ]
                                }
                            ],
                            [
                                {
                                    columns: [
                                        {
                                            text: 'Mother’s occupation:',
                                            style: 'label',
                                            width: 'auto'
                                        },
                                        {
                                            text: [item.mother_occupation],
                                            alignment: 'left',
                                            style: 'field'
                                        }
                                    ]
                                },
                                {
                                    columns: [
                                        {
                                            text: 'Guardian’s occupation:',
                                            style: 'label',
                                            width: 'auto'
                                        },
                                        {
                                            text: [item.guardian_occupation],
                                            alignment: 'left',
                                            style: 'field'
                                        }
                                    ]
                                }
                            ],
                            [
                                {
                                    columns: [
                                        {
                                            text: 'Mother’s employer:',
                                            style: 'label',
                                            width: 'auto'
                                        },
                                        {
                                            text: [item.mother_employer],
                                            alignment: 'left',
                                            style: 'field'
                                        }
                                    ]
                                },
                                {
                                    columns: [
                                        {
                                            text: 'Guardian’s employer:',
                                            style: 'label',
                                            width: 'auto'
                                        },
                                        {
                                            text: [item.guardian_employer],
                                            alignment: 'left',
                                            style: 'field'
                                        }
                                    ]
                                }
                            ],
                            [
                                {
                                    columns: [
                                        {
                                            text: 'Mother’s total annual income:',
                                            style: 'label',
                                            width: 'auto'
                                        },
                                        {
                                            text: [item.mother_total_income.toString()],
                                            alignment: 'left',
                                            style: 'field'
                                        }
                                    ]
                                },
                                {
                                    columns: [
                                        {
                                            text: 'Guardian’s total annual income:',
                                            style: 'label',
                                            width: 'auto'
                                        },
                                        {
                                            text: [item.guardian_total_income.toString()],
                                            alignment: 'left',
                                            style: 'field'
                                        }
                                    ]
                                }
                            ],
                            [
                                {
                                    columns: [
                                        {
                                            text: 'Mother’s age',
                                            style: 'label',
                                            width: 'auto'
                                        },
                                        {
                                            text: [item.mother_age.toString()],
                                            alignment: 'left',
                                            style: 'field'
                                        }
                                    ]
                                },
                                {
                                    columns: [
                                        {
                                            text: 'Guardian’s age:',
                                            style: 'label',
                                            width: 'auto'
                                        },
                                        {
                                            text: [item.guardian_age.toString()],
                                            alignment: 'left',
                                            style: 'field'
                                        }
                                    ]
                                }
                            ],
                            [
                                {
                                    columns: [
                                        {
                                            text: 'Highest level of education achieved:',
                                            style: 'label',
                                            width: 'auto'
                                        },
                                        {
                                            text: [item.mother_level_education],
                                            alignment: 'left',
                                            style: 'field'
                                        }
                                    ]
                                },
                                {
                                    columns: [
                                        {
                                            text: 'Highest level of education achieved:',
                                            style: 'label',
                                            width: 'auto'
                                        },
                                        {
                                            text: [item.guardian_level_education],
                                            alignment: 'left',
                                            style: 'field'
                                        }
                                    ]
                                }
                            ]
                        ]
                    },
                    layout: 'noBorders'
                },
                {
                    table: {
                        widths: ['*', '*'],
                        headerRows: 0,
                        body: [
                            [
                                { text: [
														'Inlines can be ',
														{ text: 'styled\n', italics: true },
														{ text: 'easily as everywhere else', fontSize: 10 } ]
												}
                            ]
                            
                        ]
                    }
                },
                {
                    text: 'The following questions will help to estimate your financial need.  Please complete all questions or your application cannot be considered.',
                    style: 'notes'
                },
                {
                    columns: [
                        {
                            text: 'Funds for college saved by you:',
                            style: 'label',
                            width: 'auto'
                        },
                        {
                            text: [item.funds_saved_you.toString()],
                            alignment: 'left',
                            style: 'field'
                        },
                        {
                            text: 'Funds for college saved by others:',
                            style: 'label',
                            width: 'auto'
                        },
                        {
                            text: [item.funds_saved_others.toString()],
                            alignment: 'left',
                            style: 'field'
                        }
                    ]
                },
                {
                    columns: [
                        {
                            text: 'Your parents’ or guardians’ total cash savings (not limited to college):',
                            style: 'label',
                            width: 'auto'
                        },
                        {
                            text: [item.total_savings.toString()],
                            alignment: 'left',
                            style: 'field'
                        }
                    ]
                },
                {
                    columns: [
                        {
                            text: 'Value of your parents’ or guardians’ other investments (NOT including home):',
                            style: 'label',
                            width: 'auto'
                        },
                        {
                            text: [item.total_investments.toString()],
                            alignment: 'left',
                            style: 'field'
                        }
                    ]
                },
                {
                    columns: [
                        {
                            text: 'Net value of your parents’ or guardians’ businesses, farms and/or ranches:',
                            style: 'label',
                            width: 'auto'
                        },
                        {
                            text: [item.net_value.toString()],
                            alignment: 'left',
                            style: 'field'
                        }
                    ]
                },
                {
                    text: 'Parents’/Guardians’ Adjusted Gross Income for 2014 (line 37 on Form 1040; line 21 on form 1040A):',
                    bold: true
                },
                {
                    columns: [
                        {
                            text: [item.adjusted_cross_income.toString()],
                            style: 'field',
                            width: 'auto'
                        },
                        {
                            text: 'Projected parental support (annual):',
                            style: 'label'
                        },
                        {
                            text: [item.projected_support.toString()],
                            style: 'field',
                            width: 'auto',
                            pageBreak: 'after'
                        }
                    ]
                },
                {
                    text: 'VI.  FINANCIAL INFORMATION  (continued)',
                    style: 'chapterheader'
                },
                {
                    text: 'Please describe any special circumstances that affect your family’s ability to fund your college expenses (response required):',
                    bold: true
                },
                {
                    text: [item.description_special_circumstances],
                    style: 'field',
                    width: 'auto'
                },
                {
                    text: 'Do you have a Texas Tomorrow Fund or 529 college savings plan?  If so, what is the plan’s value?'
                },
                {
                    text: [item.texas_tomorrow_fund],
                    style: 'field',
                    width: 'auto'
                }, {
                    text: 'Please provide the specified information for all children under 25 years of age in your family.  Do not include yourself or your parents. '
                },
                table(child, ['name', 'age', 'relationship', 'year', 'self_supporting'], ['Name', 'Age', 'Relationship', 'Year in College', 'Self-Supporting?'], [150, 50, 100, '*', '*'], 5),
                {
                    margin: [0, 0, 0, 5],
                    text: 'Do you have a sibling who is a current/past Terry Scholar or who is applying for a Terry Scholarship?  If so, please give name(s) and institution(s):'
                },
                {
                    text: [item.sibling_terry],
                    style: 'field'
                },
                {
                    text: 'VII.  UNIVERSITY SCHOLARSHIP INFORMATION',
                    style: 'chapterheader'
                },
                {
                    text: 'All entering freshmen admitted to the University of Houston are automatically considered for the University-Funded Scholarships for Freshman (http://www.uh.edu/financial/undergraduate/types-aid/scholarships/). ',
                    italics: true
                },
                {
                    margin: [0, 0, 0, 5],
                    text: 'Please indicate any college or departmental scholarships specific to your intended major for which you are applying:'
                },
                {
                    text: [item.department_scholarship],
                    style: 'field'
                },
                {
                    margin: [0, 0, 0, 5],
                    text: 'List other scholarships for which you have applied for the 2015-2016 academic year:'
                },
                table(scholarship, ['name', 'duration', 'amount'], ['Scholarship or Grant Name', 'Duration', 'Amount per year'], [200, 150, '*'], 4, 'applied'),
                {
                    margin: [0, 0, 0, 5],
                    text: 'List other scholarships or grants you will receive for the 2015-2016 academic year:'
                },
                table(scholarship, ['name', 'duration', 'amount'], ['Scholarship or Grant Name', 'Duration', 'Amount per year'], [200, 150, '*'], 4, 'received')
            ],
            pageSize: 'LETTER',
            pageMargins: [40, 60, 40, 60]

        };
    }
});