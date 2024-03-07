import { MedicalExpenses } from '@/entity/MedicalExpenses';
import { EResponse } from '@/enums/response';
import { ResponseMessage } from '@/utils/response';
import {
  ALL,
  Controller,
  File,
  Get,
  Query,
  Post,
  Provide,
} from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import * as XLSX from 'xlsx';

@Provide()
@Controller('/api/WECHAT/xlsx', { tagName: 'WECHAT' })
export default class XlsxController {
  @InjectEntityModel(MedicalExpenses, 'db_record')
  MedicalExpenses: Repository<MedicalExpenses>;

  @Post('/import')
  async importParse(@File() file) {
    const wb = XLSX.readFile(file.data);
    let sheet: Record<string, string>[] = XLSX.utils.sheet_to_json(
      wb.Sheets[wb.SheetNames[0]]
    );

    const countIdx = sheet.findIndex(v => {
      return v['科室'] === '合计';
    });
    sheet = sheet.slice(0, countIdx);

    const createdAt = new Date();
    let monthStr = `${new Date().getMonth() + 1}`;
    monthStr = monthStr.length === 1 ? `0${monthStr}` : monthStr;
    const month = `${createdAt.getFullYear()}_${monthStr}`;

    const res = await this.MedicalExpenses.save(
      sheet.map(v => {
        const model = this.MedicalExpenses.create();
        model.month = month;
        model.department = v['科室'];
        model.nursing_group = +v['护理组'];
        model.laboratory_reagents = +v['检验试剂'];
        model.interventional_materials = +v['介入材料'];
        model.anesthesia_materials = +v['麻醉材料'];
        model.surgical_equipment = +v['手术器材'];
        model.item_charges = +v['项目收费'];
        model.hemodialysis_materials = +v['血透材料'];
        model.general_medical_supplies = +v['一般医用材料'];
        model.medical_consumables = +v['医用耗材'];
        model.implant_materials = +v['植入型材料'];
        model.total = +v['合计'];
        model.createdAt = createdAt;
        return model;
      })
    );

    return new ResponseMessage(EResponse.SUCCESS, res);
  }

  @Get('/list')
  async list(@Query(ALL) query: { month: string }) {
    console.log('query', query);
    const [res, count] = await this.MedicalExpenses.findAndCount({
      where: { month: query.month || '' },
    });
    return new ResponseMessage(EResponse.SUCCESS, { rows: res, count, query });
  }
}
