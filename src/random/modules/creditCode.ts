import address from "./addr.json";
const SOCIAL_CREDIT_CHECK_CODE_DICT = {
    "0": 0,
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "A": 10,
    "B": 11,
    "C": 12,
    "D": 13,
    "E": 14,
    "F": 15,
    "G": 16,
    "H": 17,
    "J": 18,
    "K": 19,
    "L": 20,
    "M": 21,
    "N": 22,
    "P": 23,
    "Q": 24,
    "R": 25,
    "T": 26,
    "U": 27,
    "W": 28,
    "X": 29,
    "Y": 30,
}

// # GB11714-1997全国组织机构代码编制规则中代码字符集
const ORGANIZATION_CHECK_CODE_DICT = {
    "0": 0,
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "A": 10,
    "B": 11,
    "C": 12,
    "D": 13,
    "E": 14,
    "F": 15,
    "G": 16,
    "H": 17,
    "I": 18,
    "J": 19,
    "K": 20,
    "L": 21,
    "M": 22,
    "N": 23,
    "O": 24,
    "P": 25,
    "Q": 26,
    "R": 27,
    "S": 28,
    "T": 29,
    "U": 30,
    "V": 31,
    "W": 32,
    "X": 33,
    "Y": 34,
    "Z": 35,
}

interface DICT {
    [key:string]:number
}

function randint(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function choice(arr: string) {
    return arr[Math.floor(Math.random() * arr.length)];
}


class creditCode {
    constructor() { }
    get_random_address() {
        // 省的长度
        const nums_province = address.length;
        // 获取一个随机省份
        const province = address[randint(0, nums_province - 1)];

        //
        const nums_city = province['child'].length;

        const city = province["child"][randint(0, nums_city - 1)]

        //
        const areas = city['child'],
            nums_area = areas.length;

        const area = areas[randint(0, nums_area - 1)];
        const address_name = `${province.name}${city.name}${area.name}`;

        const address_code = area.code;

        return {
            name: address_name,
            code: address_code
        }
    }

    CreateC9(code: string) {

        //第i位置上的加权因子
        const weighting_factor = [3, 7, 9, 10, 5, 8, 4, 2]
        //# 第9~17 位为主体标识码(组织机构代码)
        const organization_code = code.slice(8, 17)
        //# 本体代码
        const ontology_code = organization_code.slice(0, 8)
        //# 生成校验码
        const tmp_check_code = this.gen_check_code(
            weighting_factor, ontology_code, 11, ORGANIZATION_CHECK_CODE_DICT
        )
        return code.slice(0, 16) + tmp_check_code
    }

    gen_random_credit_code() {

        //# 登记管理部门代码
        const department = "9"
        //  # 机构类别
        const agency = "123"
        const organization_num = (randint(11111111, 99999999)).toString()

        //# 行政区划代码
        const address = this.get_random_address()
        const credit_code = `${department}${choice(agency)}${address['code']}${organization_num}`
        return {
            "address": address["name"],
            "code": this.get_social_credit_code(credit_code),
        }
    }

    get_social_credit_code(code: string) {
        code = this.CreateC9(code.slice(0, 16))
        // # 第i位置上的加权因子
        const weighting_factor = [
            1,
            3,
            9,
            27,
            19,
            26,
            16,
            17,
            20,
            29,
            25,
            13,
            8,
            24,
            10,
            30,
            28,
        ]
        // # 本体代码
        const ontology_code = code.slice(0, 17)
        //# 计算校验码
        const tmp_check_code = this.gen_check_code(
            weighting_factor, ontology_code, 31, SOCIAL_CREDIT_CHECK_CODE_DICT
        )
        return code.slice(0, 17) + tmp_check_code
    }

    gen_check_code(weighting_factor: Array<number>, ontology_code: string, modulus: number, check_code_dict: DICT) {

        let total = 0;
        for (let i = 0; i < ontology_code.length; i++) {
            if (/[0-9]/.test(ontology_code[i])) {
                total += parseInt(ontology_code[i]) * weighting_factor[i];
            } else {
                total += check_code_dict[ontology_code.charCodeAt(i)] * weighting_factor[i];
            }
        }

        // const total
        let C9 = modulus - total % modulus;
        C9 = (C9 === 31) ? 0 : C9;
        let CC9 = Object.keys(check_code_dict).find(key => check_code_dict[key] === C9);
        return CC9
    }
}
const gen = new creditCode();
//导出生成的信用代码
export const genCreditCode = ()=>{
    return gen.gen_random_credit_code().code;
}