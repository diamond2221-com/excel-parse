import { EntityModel } from '@midwayjs/orm';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

@EntityModel('medical_expenses', { database: 'db_record' })
export class MedicalExpenses {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 编号
   */
  @Column({ length: 255, comment: '编号' })
  code: string;

  /**
   * 所属月份
   * 2023_03
   */
  @Column({ comment: '所属月份' })
  month: string;

  /**
   * 科室
   */
  @Column({ length: 255, comment: '科室' })
  department: string;

  /**
   * 护理组
   */
  @Column('decimal', { precision: 10, scale: 2, comment: '护理组' })
  nursing_group: number;

  /**
   * 检验试剂
   */
  @Column('decimal', { precision: 10, scale: 2, comment: '检验试剂' })
  laboratory_reagents: number;

  /**
   * 介入材料
   */
  @Column('decimal', { precision: 10, scale: 2, comment: '介入材料' })
  interventional_materials: number;

  /**
   * 麻醉材料
   */
  @Column('decimal', { precision: 10, scale: 2, comment: '麻醉材料' })
  anesthesia_materials: number;

  /**
   * 手术器材
   */
  @Column('decimal', { precision: 10, scale: 2, comment: '手术器材' })
  surgical_equipment: number;

  /**
   * 项目收费
   */
  @Column('decimal', { precision: 10, scale: 2, comment: '项目收费' })
  item_charges: number;

  /**
   * 血透材料
   */
  @Column('decimal', { precision: 10, scale: 2, comment: '血透材料' })
  hemodialysis_materials: number;

  /**
   * 一般医用材料
   */
  @Column('decimal', { precision: 10, scale: 2, comment: '一般医用材料' })
  general_medical_supplies: number;

  /**
   * 医用耗材
   */
  @Column('decimal', { precision: 10, scale: 2, comment: '医用耗材' })
  medical_consumables: number;

  /**
   * 植入型材料
   */
  @Column('decimal', { precision: 10, scale: 2, comment: '植入型材料' })
  implant_materials: number;

  /**
   * 合计
   */
  @Column('decimal', { precision: 10, scale: 2, comment: '合计' })
  total: number;

  /**
   * 创建时间
   */
  @Column('datetime', { comment: '创建时间' })
  createdAt: Date;
}
