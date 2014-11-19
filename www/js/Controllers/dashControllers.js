/*global angular, console, pdfMake */
/*jslint plusplus: true */

/**
 * @ngdoc function
 * @name controller:DashCtrl
 * @description
 * # DashController
 * Controller for objects used in the dashboard
 */
angular.module('Controllers').controller('DashCtrl', function ($scope, $filter, $ionicModal, $ionicPopup, $stateParams, DataService, items) {
    'use strict';

    $scope.items = items;
});

/**
 * @ngdoc function
 * @name controller:DashDetailCtrl
 * @description
 * # DashController
 * Controller for object details used in the dashboard
 */
angular.module('Controllers').controller('DashDetailCtrl', function ($scope, $filter, $ionicModal, $ionicPopup, $stateParams, DataService, item, coursework) {
    'use strict';

    $scope.item = item;

    // callback for ng-click 'showAddModal':
    $scope.showAddModal = function (acType) {

        $scope.myVariables.current_mode = "Add";
        $scope.location = {};
        $scope.aclass = {};
        $scope.aclass.location_id = $stateParams.itemId;

        $ionicModal.fromTemplateUrl('templates/modals/modal_' + acType + '.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });
    };

    // callback for ng-click 'saveModal':
    $scope.saveModal = function (acType) {

        switch (acType) {
        case 'locations':
            if ($scope.myVariables.current_mode === 'Add') {
                DataService.addItem(acType, $scope.location).then(
                    function (success) {
                        $scope.updateList(acType);
                        $scope.modal.hide();
                    }
                );
            } else {
                DataService.updateItem(acType, $scope.location.id, $scope.location).then(
                    function (success) {
                        $scope.modal.hide();
                    }
                );
            }
            break;
        case 'classes':
            if ($scope.myVariables.current_mode === 'Add') {
                DataService.addItem(acType, $scope.aclass).then(
                    function (success) {
                        $scope.updateList(acType);
                        $scope.modal.hide();
                    }
                );
            } else {
                DataService.updateItem(acType, $scope.aclass.id, $scope.aclass).then(
                    function (success) {
                        $scope.modal.hide();
                    }
                );
            }
            break;
        }
    };

    // callback for ng-click 'editData'
    $scope.editData = function (acType, item) {
        $scope.myVariables.current_mode = "Edit";

        $scope.Data = item;

        $ionicModal.fromTemplateUrl('templates/modals/modal_' + acType + '.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });
    };

    // callback for ng-click 'deleteData':
    $scope.deleteData = function (acType, item_id) {

        $ionicPopup.confirm({
            title: 'Confirm Delete',
            template: 'Are you sure you want to delete your ' + acType + ' item from the list?'
        }).then(function (res) {
            if (res) {
                DataService.deleteItem(acType, item_id).then(
                    function (success) {
                        $scope.updateList(acType);
                    }
                );
            }
        });
    };
    
    var externalDataRetrievedFromServer = [
        { name: 'Bartek', age: 34 },
        { name: 'John', age: 27 },
        { name: 'Elizabeth', age: 30 }
    ];
    
    function buildTableBody(data, columns, headers) {
        var body = [];

        body.push(headers);

        data.forEach(function (row) {
            var dataRow = [];

            columns.forEach(function (column) {
                dataRow.push(row[column].toString());
            });

            body.push(dataRow);
        });

        return body;
    }
    
    function buildTableWidth(widths) {
        var width = [];
        
        widths.forEach(function () {
            width.push('*');
        });

        return width;
    }
    
    function table(data, columns, headers, widths, filter) {
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
                body: buildTableBody(data, columns, headers),
                layout: {
                            hLineWidth: function(i, node) {
                                    return (i === 0 || i === node.table.body.length) ? 2 : 1;
                            },
                            vLineWidth: function(i, node) {
                                    return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                            },
                            hLineColor: function(i, node) {
                                    return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
                            },
                            vLineColor: function(i, node) {
                                    return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
                            },
                            // paddingLeft: function(i, node) { return 4; },
                            // paddingRight: function(i, node) { return 4; },
                            // paddingTop: function(i, node) { return 2; },
                            // paddingBottom: function(i, node) { return 2; }
						}
            }
        };
    }

    // callback for ng-click 'deleteData':
    $scope.createPdf = function () {

        var default_form = DataService.getApplicationForm(),
            i,
            l,
            docDefinition;

        //TODO use filter
        if (item.citizen !== undefined) {
            if (item.citzen === 'true') {
                item.citizen = 'Yes';
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
        //put NAs for all NULL values
        for (i = 0, l = default_form.length; i < l; i++) {
            if (!item.hasOwnProperty(default_form[i].name)) {
                console.log(default_form[i].name);
                item[default_form[i].name] = "N/A";
            }
        }

        docDefinition = {
            styles: {
                header: {
                    margin: [40, 20, 40, 0],
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
                    margin: [0, 10, 0, 5]
                },
                sub: {
                    bold: true,
                    margin: [0, 10, 0, 5]
                },
                label: {
                    margin: [0, 0, 0, 10]
                },
                field: {
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
                            text: [item.first_name, item.last_name]
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
                'I CERTIFY THAT I HAVE READ AND UNDERSTAND THE PRECEEDING PAGE and that the information I am providing is complete and correct to the best of my knowledge.  If my application is accepted, I agree to abide by the policies, rules, and regulations of the Terry Foundation.  I authorize the University of Houston and/or the Terry Foundation to verify the information I have provided.  I further understand that this information will be relied upon by the Terry Foundation in determining my financial eligibility and that the submission of false information is grounds for rejection of my application, and/or withdrawal of an offer of scholarship.',
                {
                    text: 'I. STUDENT INFORMATION',
                    style: 'chapterheader'
                },
                /*{
                    table:
                        {
                            headerRows: 1,
                            body:
                                [
                                    [
                                        {
                                            text: item.first_name
                                        }
                                    ],
                                    ['']
                                ]
                        },
                    layout: 'headerLineOnly'
                },*/
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
                        widths: [20, 70, 50, 20, 100, 50, 20, 80, 50],
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
                                    alignment: 'left'
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
                                    text: [item.sat_reading],
                                    alignment: 'left'
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
                                    text: [item.act_composite],
                                    alignment: 'left'
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
                                    alignment: 'left'
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
                                    alignment: 'left'
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
                                    alignment: 'left'
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
                                    alignment: 'left'
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
                                    alignment: 'left'
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
                                    alignment: 'left'
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
                                    alignment: 'left'
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
                                    alignment: 'left'
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
                                    alignment: 'left'
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
                                    alignment: 'left'
                                },
                                {
                                    text: 'Date:',
                                    alignment: 'right'
                                },
                                {
                                    text: [item.national_merit_date],
                                    alignment: 'left'
                                }
                            ],
                            [
                                {
                                    text: 'National Achievement:'
                                },
                                {
                                    text: [item.national_achievement],
                                    alignment: 'left'
                                },
                                {
                                    text: 'Date:',
                                    alignment: 'right'
                                },
                                {
                                    text: [item.national_achievement_date],
                                    alignment: 'left'
                                }
                            ],
                            [
                                {
                                    text: 'National Hispanic:'
                                },
                                {
                                    text: [item.national_hispanic],
                                    alignment: 'left'
                                },
                                {
                                    text: 'Date:',
                                    alignment: 'right'
                                },
                                {
                                    text: [item.national_hispanic_date],
                                    alignment: 'left'
                                }
                            ]
                        ]
                    },
                    layout: 'noBorders'
				},
                {
                    text: 'III.	PRE-AP, ADVANCED PLACEMENT (AP), INTERNATIONAL BACCALAUREATE PROGRAM (IB), OR DUAL CREDIT (DC) COURSEWORK TAKEN IN HIGH SCHOOL',
                    style: 'chapterheader'
                },
                table(coursework, ['name', 'type', 'credit_hours', 'final_grade'], ['Sophomore Level Coursework', 'AP/IB/DC', 'Credit Hours:', 'Final Grade'], ['100', '*', '*', '*'], 'sophomore'),
                table(coursework, ['name', 'type', 'credit_hours', 'final_grade'], ['Sophomore Level Coursework', 'AP/IB/DC', 'Credit Hours:', 'Final Grade'], ['100', '*', '*', '*'], 'junior'),
                table(coursework, ['name', 'type', 'credit_hours', 'final_grade'], ['Sophomore Level Coursework', 'AP/IB/DC', 'Credit Hours:', 'Final Grade'], ['100', '*', '*', '*'], 'senior'),
            ]
                
        };

        pdfMake.fonts = {
            TimesNewRoman: {
                normal: 'Times-New-Roman-Regular.ttf',
                bold: 'Times-New-Roman-Bold.ttf',
                italics: 'Times-New-Roman-Italic.ttf',
                bolditalics: 'Times-New-Roman-Bold-Italic.ttf'
            }
        };

        try {
            pdfMake.createPdf(docDefinition).open();
        } catch (err) {
            console.log(err);
        }
        
    };

    $scope.updateList = function (acType) {
        switch (acType) {
        case 'locations':
            // GET 
            DataService.getAllItems(acType).then(
                function (result) {
                    $scope.locations = result;
                }
            );
            break;
        case 'classes':
            // GET 
            DataService.getAllItems(acType).then(
                function (result) {
                    $scope.classes = result;
                }
            );
            break;
        }
    };


});