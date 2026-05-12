import { registerMvuSchema } from 'https://testingcf.jsdelivr.net/gh/StageDog/tavern_resource/dist/util/mvu_zod.js';

export const Schema = z.object({
  角色状态: z.object({
    主角境界: z.string().prefault('元婴前期'),
    白荔境界: z.string().prefault('元婴前期'),
    庭玉境界: z.string().prefault('炼气巅峰'),
  }).prefault({}),
  羁绊系统: z.object({
    白荔羁绊值: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    庭玉羁绊值: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
  }).prefault({}),
  功法领悟系统: z.object({
    白荔七情进度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    主角有情剑进度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
  }).prefault({}),
}).prefault({});

$(() => {
  registerMvuSchema(Schema);
});
