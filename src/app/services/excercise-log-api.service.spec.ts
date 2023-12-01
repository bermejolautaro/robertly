import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import isoWeek from 'dayjs/plugin/isoWeek';
import ***REMOVED*** processDataFirstStep, processDataSecondStep, processDataThirdStep ***REMOVED*** from '../services/excercise-log-api.service';
import ***REMOVED*** amountDaysTrained ***REMOVED*** from '@helpers/excercise-log.helper';

import * as R from 'remeda';

dayjs.extend(customParseFormat);
dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

describe('ExcerciseLogApiService', () => ***REMOVED***
  const data = [
    ['Push', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    [
      '',
      '14/04/2023',
      '20/04/2023',
      '26/04/2023',
      '2/05/2023',
      '8/05/2023',
      '10/05/2023',
      '12/05/2023',
      '15/05/2023',
      '19/05/2023',
      '23/05/2023',
      '31/05/2023',
      '15/06/2023',
      '3/07/2023',
      '7/07/2023',
      '12/07/2023',
      '15/07/2023',
      '20/07/2023',
      '27/07/2023',
      '3/08/2023',
      '9/08/2023',
      '16/08/2023',
      '22/08/2023',
      '31/08/2023',
      '6/09/2023',
      '16/09/2023',
      '19/09/2023',
      '26/10/2023',
      '31/10/2023',
      '4/11/2023',
      '9/11/2023',
    ],
    ['Pecho plano', '50-12|50-12|50-9', '55-10|55-9|55-7', '55-9|55-9|55-4', '', '55-9|55-9|55-9', '', '55-11|55-9|55-9', '60-6|60-6|60-6'],
    ['Pecho inclinado', '40-11|40-12|40-10', '40-12|40-12|40-12', '45-8|45-8|45-7', '', '45-6|45-6|45-6', ''],

    [],
    ['Pull'],
    ['', '17/04/2023', '21/04/2023', '28/04/2023', '4/05/2023'],
    ['Pulldown over', '47-12|53-10|47-12', '', '47-12|47-15|47-12', '', '', '', '', '47-12|47-12|47-12', '', '', '', '53-12|53-12|59-10'],
  ];

  const data2 = [
    ['Push'],
    [
      '',
      '14/04/2023',
      '20/04/2023',
      '26/04/2023',
      '2/05/2023',
      '8/05/2023',
      '10/05/2023',
      '12/05/2023',
      '15/05/2023',
      '19/05/2023',
      '23/05/2023',
      '31/05/2023',
      '15/06/2023',
      '3/07/2023',
      '7/07/2023',
      '12/07/2023',
      '15/07/2023',
      '20/07/2023',
      '27/07/2023',
      '3/08/2023',
      '9/08/2023',
      '16/08/2023',
      '22/08/2023',
      '31/08/2023',
      '6/09/2023',
      '16/09/2023',
      '19/09/2023',
      '26/10/2023',
      '31/10/2023',
      '4/11/2023',
      '9/11/2023',
    ],
    [
      'Pecho plano',
      '50-12|50-12|50-9',
      '50-12|50-12|50-12',
      '55-10|55-9|55-6',
      '55-10|55-9|55-7',
      '55-9|55-9|55-4',
      '',
      '55-9|55-9|55-9',
      '',
      '55-11|55-9|55-9',
      '60-6|60-6|60-6',
      '60-6|60-6|55-8',
      '60-5|60-3|55-4',
      '60-2|60-3|60-2',
      '',
      '60-8|65-3|70-1',
      '60-6|65-1|65-1',
      '60-7|65-1|65-1',
      '',
      '60-4|65-3|65-4',
      '',
      '65-6|70-2|75-1',
      '',
      '65-4|70-1|60-5',
      '65-4|70-2|75-1|55-12',
      '60-6|60-4|60-3|50-12',
      '',
      '',
      '',
      '',
      '60-8|65-3|55-12',
    ],
    [
      'Pecho inclinado',
      '40-11|40-12|40-10',
      '40-12|40-12|40-12',
      '45-8|45-8|45-7',
      '',
      '45-6|45-6|45-6',
      '',
      '45-12|45-9|45-9',
      '',
      '45-12|45-8|45-6',
      '45-10|45-9|45-10',
      '45-11|45-7|45-5',
      '40-7|40-12|40-12',
      '40-12|40-12|40-12',
      '',
      '45-7|50-4|55-2',
      '50-6|55-3|40-10',
      '50-6|55-1|40-15',
      '40-12|50-8|50-6',
      '50-4|50-4|55-2',
      '',
      '40-12|45-10|50-4',
      '',
      '40-15|45-10|45-9',
      '40-12|40-12|40-6',
      '40-10|40-8|40-12',
    ],
    ['Pec fly', '35-12|35-12|35-12', '', '', '', '', '', '', '', '', '41-12|41-12|41-12', '', '41-12|47-7|41-12'],
    ['Chest press', '', '', '', '', '41-8|41-6|35-10|41-8'],
    [
      'Overhead press',
      '30-5|30-4|30-2',
      '25-6|25-7|25-6',
      '25-12|25-12|25-12',
      '30-9|30-6|30-7',
      '30-7|30-6|30-7',
      '',
      '30-10|30-10|30-10',
      '',
      '30-4|30-6|30-6',
      '30-8|30-7|30-7',
      '',
      '30-7|30-8|30-7',
      '',
      '',
      '30-8|30-8|40-2',
      '40-2|35-8|35-8',
      '',
      '',
      '',
      '',
      '40-2|35-4|30-6',
      '',
      '30-12|30-7|30-8',
      '30-12|30-8|30-4',
      '30-7|30-8|30-5',
      '30-7|30-8|30-5',
      '',
      '',
      '',
      '30-7|30-5|30-5',
    ],
    ['Shoulder press db'],
    [
      'Lateral raises polea',
      '11-6|11-6|11-6',
      '',
      '',
      '',
      '',
      '11-12|11-12|11-12',
      '',
      '10-15|10-15|10-12',
      '',
      '10-15|10-15|10-15',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '10-15|10-15|10-12',
      '',
      '11-12|11-12|11-12',
    ],
    [
      'Lateral raises db',
      '',
      '10-8|10-8|10-8',
      '',
      '10-9|10-10|10-8',
      '10-10|10-6|10-10',
      '',
      '10-10|10-10|10-6',
      '',
      '6-20|6-20|6-20',
      '',
      '8-12|8-12|8-12',
      '7-12|7-12|8-12',
      '9-6|9-12|9-15',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '8-12|8-12|8-12',
    ],
    [
      'Tricep polea soga',
      '23-12|23-12|23-12',
      '23-12|29-4|29-4',
      '29-8|29-6|29-6',
      '',
      '29-12|29-8|29-8',
      '',
      '',
      '',
      '',
      '30-9|30-5|30-6',
      '',
      '29-12|29-7|29-12',
      '29-12|29-12|29-12',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '35-10|35-6|35-4',
      '35-5|23-12|23-12',
      '23-12|23-10|23-10',
    ],
    [
      'Tricep polea barra',
      '',
      '',
      '',
      '35-10|35-7|35-6',
      '',
      '',
      '35-12|35-12|35-12',
      '',
      '29-8|29-15|29-12',
      '',
      '29-12|29-12|29-12',
      '35-12|35-10|35-12',
    ],
    ['Skullcrusher', '', '', '', '', '', '', '', '', '6-6|5-11|5-6'],
    ['Pecho inclinado smith'],
    [
      'Cruce polea',
      '',
      '20-12|20-12|20-12',
      '',
      '',
      '',
      '',
      '25-12|25-12|25-10',
      '',
      '25-10|25-6|20-12|20-12',
      '',
      '',
      '',
      '25-15|25-15|25-15',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '25-12|25-8',
    ],
    [
      'Pecho inclinado db',
      '',
      '',
      '',
      '17,5-12|17,5-7|17,5-7',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '15-16|17,5-12|17,5-8',
    ],
    [],
    ['Pull'],
    [
      '',
      '17/04/2023',
      '21/04/2023',
      '28/04/2023',
      '4/05/2023',
      '10/05/2023',
      '15/05/2023',
      '20/05/2023',
      '26/05/2023',
      '1/06/2023',
      '16/06/2023',
      '4/07/2023',
      '13/07/2023',
      '17/07/2023',
      '24/07/2023',
      '29/07/2023',
      '10/08/2023',
      '17/08/2023',
      '29/08/2023',
      '2/09/2023',
      '13/09/2023',
      '21/09/2023',
      '1/11/2023',
      '7/11/2023',
      '11/11/2023',
    ],
    [
      'Pulldown over',
      '47-12|53-10|47-12',
      '53-12|53-12|53-8',
      '53-12|53-12|53-12',
      '53-12|53-12|53-12',
      '53-5|53-5|53-12',
      '47-15|47-15|47-15',
      '53-12|47-7|47-12',
      '53-12|53-12|53-12',
      '',
      '47-12|47-15|47-12',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '47-12|47-12|47-12',
      '',
      '',
      '',
      '53-12|53-12|59-10',
    ],
    [
      'Pulldown under',
      '',
      '47-12|47-12|47-10',
      '',
      '53-12|53-12|53-9',
      '',
      '53-12|53-12|65-5',
      '47-12|47-12|47-12',
      '',
      '47-12|47-12|53-9',
      '47-12|47-12|47-10',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '53-9|47-14|53-5',
    ],
    ['Pulldown V', '53-6|53-8|47-12', '', '53-8|53-8|53-8', '', '53-4', '', '', '53-7|53-8|53-8'],
    ['Remo cerrucho'],
    ['Remo olimpico', '50-6|50-12|50-12', '50-12|50-12|50-12', '', '', '', '', '', '50-12|50-12|55-7'],
    [
      'Remo caballo',
      '',
      '',
      '15-12|17,5-12|17,5-12',
      '20-12|20-12|20-13',
      '',
      '20-5|20-10|20-12',
      '',
      '',
      '20-15|20-15|20-15',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '20-12|20-15|20-12',
      '',
      '',
      '',
      '17,5-20|20-12|20-12',
    ],
    ['Remo landmine', '', '', '', '', '', '', '', '', '', '30-15|35-15|40-12'],
    ['Remo maquina', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '45-12|50-12|55-12'],
    [
      'Shrugs',
      '40-30|60-12|60-15',
      '60-15|60-15|60-15',
      '65-12|65-12|65-12',
      '70-12|70-12|70-12',
      '60-10|60-12|60-7',
      '',
      '40-12|40-12|40-12',
      '50-12|60-10|50-15',
      '',
      '50-12|50-12|50-12',
    ],
    ['Shrugs db', '', '', '', '', '', '22,5-20|22,5-20|22,5-20', '', '', '25-12|25-12|25-15'],
    ['Pull-ups', '70,4-3|70,4-3|70,4-2'],
    [
      'Chin-ups',
      '',
      '69,5-7|69,5-3|69,5-5',
      '71,1-2|71,1-3|71,1-3',
      '',
      '70,1-8|70,1-5|70,1-5',
      '',
      '69,8-7|69,8-6|69,8-6',
      '',
      '70-9|70-5|70-4',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '72,4-7|72,4-5|72,4-3',
    ],
    [
      'Bicep curl',
      '10-12|10-12|10-12',
      '12,5-12|12,5-7|12,5-8',
      '12,5-12|12,5-9|12,5-7',
      '15-4|12,5-12|12,5-15',
      '15-5|15-5|15-5',
      '15-5|15-5|15-4',
      '15-6|15-4|15-5',
      '12,5-12|12,5-12|12,5-12',
      '15-7|15-6|15-4',
      '10-12|10-12|10-12',
      '',
      '15-7|15-3|15-4',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '12,5-12|12,5-8|12,5-6',
    ],
    [
      'Bicep martillo',
      '',
      '8-12|8-12|8-12',
      '',
      '9-12|9-6|9-6',
      '9-12|9-12|9-12',
      '10-12|10-12|10-12',
      '9-12|9-12|9-12',
      '',
      '10-12|10-12|10-12',
      '',
      '',
      '10-10|10-10|10-10',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '15-7|15-4|15-3',
    ],
    ['Bicep preacher db', '', '', '', '', '', '', '', '', '', '20-15|20-13|20-8'],
    ['Espinales', '', '', '', '10-12|10-12|10-12'],
    ['Forearm barra', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '15-12|15-12|'],
    [],
    ['Legs'],
    [
      '',
      '19/04/2023',
      '29/04/2023',
      '5/05/2023',
      '11/05/2023',
      '16/05/2023',
      '20/05/2023',
      '22/05/2023',
      '29/05/2023',
      '12/06/2023',
      '11/07/2023',
      '15/07/2023',
      '18/07/2023',
      '26/07/2023',
      '31/07/2023',
      '15/08/2023',
      '18/08/2023',
      '5/09/2023',
      '14/09/2023',
      '8/11/2023',
    ],
    [
      'Sentadilla',
      '',
      '',
      '65-7|65-7|65-4',
      '',
      '',
      '',
      '',
      '60-12|60-12|60-6',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '70-12|80-8|90-4',
      '',
      '',
      '20-12|22,5-12|30-6',
    ],
    ['Sentadilla Bulgara', '6-12|6-12|6-12', '', '', '', '', '', '', '', '8-12|8-12|8-12'],
    [
      'Sillon Cuadricep',
      '35-12|35-12|35-20',
      '41-12|41-12|41-12',
      '47-12|47-12|47-12',
      '53-20|59-12|59-12',
      '',
      '',
      '65-12|65-12|65-12',
      '53-12|53-12|53-12',
      '47-12|47-12|47-12',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '47-12|47-12|47-12',
    ],
    ['Sillon Cuadricep 1 Pierna', '', '', '', '', '17-15|17-15|17-15'],
    ['Femorales', '', '', '23-20|23-20|23-12', '', '', '', '', '23-12|23-12|23-12'],
    [
      'Gemelos',
      '',
      '',
      '10-12|10-12|10-12',
      '10-15|10-12|10-12',
      '',
      '10-12|10-12|10-12',
      '10-12|12-12|12-12',
      '10-12|12-12|12-12',
      '12-12|12-12|12-12',
    ],
    ['Patada', '17-12|17-12|17-12', '', '', '23-12|23-12|23-12', '', '', '', '', '', '', '', '', '', '', '', '', '', '23-12|23-12|17-12'],
    ['Peso muerto', '', '100-12|100-12|100-12', '', '90-12|90-12|90-12', '', '', '105-12|110-3|120-2|125-2|130-1'],
    [
      'Hip thrust',
      '',
      '65-12|65-12|65-12',
      '',
      '65-12|70-12|70-12',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '60-12|60-12|60-12',
    ],
    ['Hip thrust polea', '', '', '', '', '23-12|23-12|23-12', '', '29-12|35-12|41-12'],
    [
      'Sentadilla smith',
      '50-12|50-12|50-8',
      '',
      '',
      '',
      '50-6|50-8|50-4',
      '',
      '',
      '',
      '40-12|40-12|40-12',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '40-12|50-8|50-7',
    ],
    ['Abductores', '', '', '17-20|23-20|29-20'],
    ['Leg press', '', '', '', '', '35-15|47-15|59-15'],
    ['Zancada smith', '', '', '', '', '', '', '', '20-8|20-12|20-4'],
  ];

  it('first step tests', () => ***REMOVED***
    const result = processDataFirstStep(data2);
    const [a, b] = processDataSecondStep(result);
    debugger;
    const result3 = processDataThirdStep(a, data2, b);

    const result4 = R.uniqBy(result3, x => x.date).map(x => x.date);

    const amount = amountDaysTrained(result3);

    expect(amount).toBe(69);
***REMOVED***);
***REMOVED***);
