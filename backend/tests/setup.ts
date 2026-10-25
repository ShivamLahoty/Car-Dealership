import { randomUUID } from 'crypto';

process.env.DB_FILE = `test-${randomUUID()}.db`;
process.env.JWT_SECRET = '1190b2fcd3403c288f998b1d4f12c0c282d9146eb9c830c7a3f15ea897ead28d2ccfc4ec8d34a545ec2d2befa4a539593e4bd2b866a0751211224726c6c2f970';