/*global angular, console, pdfMake */
/*jslint plusplus: true */

/**
 * @ngdoc function
 * @name controller:DashCtrl
 * @description
 * # DashController
 * Controller for objects used in the dashboard
 */
angular.module('Controllers').controller('DashCtrl', function ($scope, $filter, $ionicLoading, $ionicModal, $ionicPopup, items, DataService, DownloadService) {
    'use strict';
    
    //get data for view
    $scope.items = items;
    $scope.items.length = Object.keys(items).length - 1;
    
    $scope.downloadEssay1 = function(id) {
        return DownloadService.get(id, 'essay1*');
    };
    $scope.downloadEssay2 = function(id) {
        return DownloadService.get(id, 'essay2*');
    };
    
    function buildTableBody(data, columns, headers) {
        var body = [];

        body.push(headers);
        
        if (data !== undefined) {

            data.forEach(function (row) {
                var dataRow = [];

                columns.forEach(function (column) {
                    dataRow.push(row[column].toString());
                });

                body.push(dataRow);
            });
        }

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
                layout:
                    {
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

    // callback for ng-click 'deleteData':
    $scope.createPdf = function (item) {
        
        $ionicLoading.show();
        var coursework = DataService.getItemList('coursework', item.id);
        var activity = DataService.getItemList('activity', item.id);
        var employment = DataService.getItemList('employment', item.id);
        var volunteer = DataService.getItemList('volunteer', item.id);
        var awards = DataService.getItemList('awards', item.id);
        var university = DataService.getItemList('university', item.id);
        
        $ionicLoading.hide();

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
                                    text: [item.sat_reading.toString()],
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
                                    text: [item.act_composite.toString()],
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
                table(activity, ['name', 'type', 'credit_hours', 'final_grade'], ['Sophomore Level Coursework', 'AP/IB/DC', 'Credit Hours:', 'Final Grade'], ['100', '*', '*', '*'], 'senior'),
                
                {
                    pageBreak: 'after',
                    text: ''
                },
                
                {
                    text: 'For sections IV & V, fill space provided completely.  Do not submit a resume in lieu of completing sections IV & V.  Important:  If you are a recruited athlete, DO NOT include any information about your athletic participation or achievements on this application.',
                    style: 'chapterheader'
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
                    text: 'List all of your previous and current jobs or internships.  Include your job title, your employer’s name, how many hours per week you worked, and the dates of employment.  List your most recent activities first.',
                },
                
                table(employment, ['position', 'employer', 'hours', 'date_from', 'date_to'], ['Position/Job Title', 'Employer', 'Hours Per Week', 'From:', 'To:'],['100', '*', '*', '*', '*']),
               
                table(employment, ['position', 'employer', 'hours', 'date_from', 'date_to'], ['Position/Job Title', 'Employer', 'Hours Per Week', 'From:', 'To:'],['100', '*', '*', '*', '*']),
                
                table(employment, ['position', 'employer', 'hours', 'date_from', 'date_to'], ['Position/Job Title', 'Employer', 'Hours Per Week', 'From:', 'To:'],['100', '*', '*', '*', '*']),
                
                table(employment, ['position', 'employer', 'hours', 'date_from', 'date_to'], ['Position/Job Title', 'Employer', 'Hours Per Week', 'From:', 'To:'],['100', '*', '*', '*', '*']),
                
                {
                    text: 'Extracurricular Activities and Leadership Positions',
                    style: 'notes'
                },
                {
                    text: 'In order of importance to you, list your top six extracurricular activities (include band, clubs, affiliations, etc.) and the position(s) you held.',
                },
                
                table(activity, ['activity', 'position', 'description', 'year'], ['Organization/Activity', 'Position(s) Held', 'Description of Activity', 'FR/SO/JR/SR'],['100', '*', '*', '*']),
               
                table(activity, ['activity', 'position', 'description', 'year'], ['Organization/Activity', 'Position(s) Held', 'Description of Activity', 'FR/SO/JR/SR'],['100', '*', '*', '*']),
                
                table(activity, ['activity', 'position', 'description', 'year'], ['Organization/Activity', 'Position(s) Held', 'Description of Activity', 'FR/SO/JR/SR'],['100', '*', '*', '*']),
                
                table(activity, ['activity', 'position', 'description', 'year'], ['Organization/Activity', 'Position(s) Held', 'Description of Activity', 'FR/SO/JR/SR'],['100', '*', '*', '*']),
                
                {
                    text: 'Community or Volunteer Service',
                    style: 'notes'
                },
                {
                    text: 'Describe your role in the organization, the type of organization you were associated with, how many hours of service you devoted each week, and when you participated in each activity.  List your most recent service first.',
                },
                
                table(volunteer, ['place', 'description', 'hours_week', 'hours_total', 'date_from', 'date_to'], ['Place of Service', 'Description of Service', 'Hours/Week', 'Hours/Total', 'From:', 'To:'],['100', '*', '*', '*', '*', '*']),
               
                 table(volunteer, ['place', 'description', 'hours_week', 'hours_total', 'date_from', 'date_to'], ['Place of Service', 'Description of Service', 'Hours/Week', 'Hours/Total', 'From:', 'To:'],['100', '*', '*', '*', '*', '*']),
                
                 table(volunteer, ['place', 'description', 'hours_week', 'hours_total', 'date_from', 'date_to'], ['Place of Service', 'Description of Service', 'Hours/Week', 'Hours/Total', 'From:', 'To:'],['100', '*', '*', '*', '*', '*']),
                
                 table(volunteer, ['place', 'description', 'hours_week', 'hours_total', 'date_from', 'date_to'], ['Place of Service', 'Description of Service', 'Hours/Week', 'Hours/Total', 'From:', 'To:'],['100', '*', '*', '*', '*', '*']),
                
                {
                    text: 'Awards, Special Honors, and Distinctions',
                    style: 'notes'
                },
                {
                    text: 'In order of importance to you, list up to six major awards, honors, or distinctions that you received both in and out of school during grades 9-12.',
                },
                
                table(awards, ['award', 'description', 'level', 'year'], ['Award/Distinction/Honor', 'Description/Basis for or Sponsor of Award', 'Level of Competition', 'FR/SO/JR/SR'],['100', '*', '*', '*']),
               
                table(awards, ['award', 'description', 'level', 'year'], ['Award/Distinction/Honor', 'Description/Basis for or Sponsor of Award', 'Level of Competition', 'FR/SO/JR/SR'],['100', '*', '*', '*']),
                
                table(awards, ['award', 'description', 'level', 'year'], ['Award/Distinction/Honor', 'Description/Basis for or Sponsor of Award', 'Level of Competition', 'FR/SO/JR/SR'],['100', '*', '*', '*']),
                
                table(awards, ['award', 'description', 'level', 'year'], ['Award/Distinction/Honor', 'Description/Basis for or Sponsor of Award', 'Level of Competition', 'FR/SO/JR/SR'],['100', '*', '*', '*']),
                
                {
                    pageBreak: 'after',
                    text: ''
                },
                
                {
                    text: 'V.  COLLEGE PLANS',
                    style: 'chapterheader'
                },
                {
                    columns: [
                        {
                            text: 'Will you be the first in your family to graduate college?',
                            style: 'label',
                            width: 'auto'
                        },
                        {
                            text: [item.first_graduate],
                            style: 'field'
                        }
                    ]
                },
                
                {
                    columns: [
                        {
                            text: 'Why have you chosen to apply to the University of Houston?',
                            style: 'label',
                            width: 'auto'
                        },
                        {
                            text: [item.why_apply],
                            style: 'field'
                        }
                    ]
                },
                
                 {
                    text: 'List, in order of preference, the top six colleges or universities you are considering attending (be sure to rank the University of Houston among your choices):',
                    style: 'notes'
                },
               table(university, ['name', 'name', 'name'], ['University Name', 'University Name', 'University Name'],['100', '100', '100']),
               table(university, ['name', 'name', 'name'], ['University Name', 'University Name', 'University Name'],['100', '100', '100']),
                {
                    columns: [
                        {
                            text: 'Why have you chosen your academic major(s)?',
                            style: 'label',
                            width: 'auto'
                        },
                        {
                            text: [item.why_major],
                            style: 'field'
                        }
                    ]
                },
                
                {
                    columns: [
                        {
                            text: 'Briefly describe any educational plans you have beyond earning your Bachelor’s degree:',
                            style: 'label',
                            width: 'auto'
                        },
                        {
                            text: [item.educational_plans],
                            style: 'field'
                        }
                    ]
                },
                
                {
                    columns: [
                        {
                            text: 'What are some of your life’s goals and objectives?',
                            style: 'label',
                            width: 'auto'
                        },
                        {
                            text: [item.life_goals],
                            style: 'field'
                        }
                    ]
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
                    columns: [
                        {
                            text: 'Your marital status:',
                            style: 'label',
                            width: 'auto'
                        },
                        {
                            text: [item.marital_status],
                            alignment: 'left',
                            style: 'field'
                        },
                        {
                            text: 'Your parents’ marital status:',
                            style: 'label',
                            width: 'auto'
                        },
                        {
                            text: [item.marital_status_parents],
                            alignment: 'left',
                            style: 'field'
                        }
                    ]
                },
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
                        },
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
                },
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
                        },
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
                },
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
                        },
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
                },
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
                        },
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
                },
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
                        },
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
                },
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
                        },
                        {
                            text: 'Highest level of education ahcieved:',
                            style: 'label',
                            width: 'auto'
                        },
                        {
                            text: [item.stepparent_level_education],
                            alignment: 'left',
                            style: 'field'
                        }
                    ]
                },
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
                        },
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
                },
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
                        },
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
                },
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
                        },
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
                },
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
                        },
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
                },
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
                        },
                        {
                            text: 'Highest level of education ahcieved:',
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
            //console.log('Create pdf from:');
            //console.log(docDefinition);
            pdfMake.createPdf(docDefinition).open();
        } catch (err) {
            console.log(err);
        }
        
    };

    
    
});

/**
 * @ngdoc function
 * @name controller:DashDetailCtrl
 * @description
 * # DashController
 * Controller for object details used in the dashboard
 */
angular.module('Controllers').controller('DashDetailCtrl', function ($scope, $filter, $ionicModal, $ionicPopup, $stateParams, DataService, item, coursework, activity) {
    'use strict';

    
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