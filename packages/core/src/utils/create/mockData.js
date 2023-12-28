import Mock from 'mockjs';

 let mockUser = {
    "UserId": "f4519f848aab479e8bb9dd7c8506e86a",
    "UserName": "预览用户",
    "LastLoginTime": 1665970625290,
    "LoginCount": 2,
    "Status": "normal",
    "CreateTime": 1665629607385,
    "UpdateTime": 1665970625290,
    "Source": "Normal",
    "Env": "dev",
    "ThirdUserId": ""
}
const toMockData = (type) => {
    let mockData
    if (type === 'Boolean') {
        mockData = Mock.mock('@boolean')
    }
    if (type === 'Long') {
        mockData = Mock.mock('@natural')//自然数没有负数
        // mockData = Mock.mock('@integer')
    }
    if (type === 'Decimal') {
        mockData = Mock.mock('@float')
    }
    if (['String', 'Text'].includes(type)) {
        mockData = Mock.mock('@word')
        // mockData =Mock.mock('@string')
    }
    if (type === 'Date') {
        mockData = Mock.mock('@date')
    }
    if (type === 'Time') {
        mockData = Mock.mock('@time')
    }
    // 需要看下是否需要调整格式 "1994-10-16 02:56:12"
    if (type === 'DateTime') {
        mockData = Mock.mock('@datetime')
    }
    return mockData
}
let getPropValue = (list, parentTypeName) => {
    let parent = parentTypeName === 'List' ? [] : {}
    return list.reduce((acc, prop) => {
        if (parentTypeName === 'List') {
            acc.push({ [prop.name]: naslTypeToJSType(prop.typeAnnotation) })
            return acc
        }
        acc[prop.name] = naslTypeToJSType(prop.typeAnnotation)
        return acc
    }, parent)
}
const naslTypeToJSType = (typeAnnotation, parentTypeName) => {
    let {
        typeKind,
        typeName,
        typeNamespace
    } = typeAnnotation
    if (typeKind && typeKind === 'anonymousStructure') {
        let typeItem = typeAnnotation
        let targetMap = 'properties'
        return getPropValue(typeItem[targetMap], parentTypeName)
    } else if (typeKind && ['reference'].includes(typeKind)) {
        let targetMap = 'properties'
        let typeItem = window.dataTypesMap[`${typeNamespace}.${typeName}`]
        if (typeNamespace === "app.enums") {
            // targetMap  = 'enumItems'
            // 枚举是编译成这样的对象 {k:v,v:k}
            // "value": "Normal",
            // "label": "正常"
            // 枚举是直接获取一项的value 直接取第一项
            return typeItem.enumItems[0].value
            // return typeItem[targetMap].reduce((mockData ,prop) => {
            //     mockData[prop.name]= Mock.mock({
            //         "object|1": {
            //           [prop.label]:[prop.value],
            //         }
            //       })
            //     return mockData
            // },{})
        }
        // 引用类型一定是个map Object 但是 value 可以是任意值  也可以嵌套自己
        // 引用类型嵌套引用类型 引用类型嵌套自己
        return getPropValue(typeItem[targetMap], parentTypeName)
    } else if (typeName && ['Union', "List",].includes(typeName)) {
        // 引用数据结构一定是对象 但是List 要生成为数组
        return naslTypeToJSType(typeAnnotation?.typeArguments?.[0], typeName)
    } else if (typeName && ["Map"].includes(typeName)) {
        // "generic"  TODO 待验证复杂类型 map 不能直接取0  0key 1value
        let key = naslTypeToJSType(typeAnnotation?.typeArguments?.[0])
        let value = naslTypeToJSType(typeAnnotation?.typeArguments?.[1])
        return Mock.mock({ "object|1": { key: value } })
    } else if (typeKind && typeKind === 'primitive') {
        //    "typeKind":"primitive"
        //    "typeNamespace":"nasl.core"
        //    "typeName":"Boolean"
        return toMockData(typeName)
    }
}
const adaptorApiPath = () => {
    // todo: 还有下沉非下沉的区别   根据path判断吧（是否有nuims)来决定是不是下沉接口 非下沉的 有DATA
}
export const createMockService = (apiSchemaList, serviceConfig, dynamicServices) => {
    const newApiSchemaMap = apiSchemaList
    let apiList = Object.keys(newApiSchemaMap)
    let result = {}
    apiList.map(api => {
        let data
        let apiInfo = newApiSchemaMap[api]
        if (!apiInfo.config && api === 'GetUser') {
            data = { Data: mockUser }
        } else if (!apiInfo.config && api === 'GetUserResources') {
            // todo: 这里要根据权限表 返回某个角色的所有权限
            let currRole = "DEV-AdminRole"
            let PList = [
                { resourceType: 'ui', resourcePath: "/permission_center/resourceManagement", roleName: "DEV-AdminRole" },
                { resourceType: 'ui', resourcePath: "/permission_center/addRoleUser", roleName: "DEV-AdminRole" },
                { resourceType: 'ui', resourcePath: "/permission_center/roleManagement", roleName: "DEV-AdminRole" },
                { resourceType: 'ui', resourcePath: "/permission_center/userManagement", roleName: "DEV-AdminRole" },
                { resourceType: 'ui', resourcePath: "/permission_center", roleName: "DEV-AdminRole" }
            ]
            data = PList.filter(it => it.roleName === currRole).map(it => {
                return {
                    resourceValue: it.resourcePath,
                    resourceType: 'ui',
                }
            })
        } else {
            // todo 还得看下普通的第三放接口是不是有Data 这个接口
            let returns = apiInfo?.returns || []
            data = returns && returns.map(re => re?.typeAnnotation && naslTypeToJSType(JSON.parse(re?.typeAnnotation)))
        }
        async function mockRequest() {
            console.log('mock 普通 arguments: ', api, arguments);
            return Promise.resolve(data)
        }
        result[api] = mockRequest
    })
    console.log('xx: ', result);

    return result
};
export const createMockLogicService = (apiSchemaList, serviceConfig, dynamicServices) => {
    const newApiSchemaMap = apiSchemaList
    let apiList = Object.keys(newApiSchemaMap)
    let result = {}
    apiList.map(api => {
        if (api === 'app.logics.LCAPLoadRoleManagementTableView') { debugger }
        let data
        let apiInfo = newApiSchemaMap[api]
        let returns = apiInfo?.returns || []
        let list = returns && returns.map(re => re?.typeAnnotation && naslTypeToJSType(JSON.parse(re?.typeAnnotation)))
        data = list?.[0] || {}
        async function mockRequest() {
            console.log('Logic mock params: ', api, arguments, data);
            return Promise.resolve(data)
        }
        !result[api] && (result[api] = mockRequest)
        return result
    })
    console.log('createMockLogicService: ', result);
    return result
};

export const createMockServiceByData = (api, data,allLogics= {} ) => {
      if (api === 'GetUser') {
            data = { Data: mockUser }
        } else if (  api === 'GetUserResources') {
            let roles = JSON.parse(window?.allMockData?.roles)
            let currRole = roles?.currentRole || "DEV-AdminRole"
            let PList = roles.roleResourceMappingList ||  [
                { resourceType: 'ui', resourcePath: "/permission_center/resourceManagement", roleName: "DEV-AdminRole" },
                { resourceType: 'ui', resourcePath: "/permission_center/addRoleUser", roleName: "DEV-AdminRole" },
                { resourceType: 'ui', resourcePath: "/permission_center/roleManagement", roleName: "DEV-AdminRole" },
                { resourceType: 'ui', resourcePath: "/permission_center/userManagement", roleName: "DEV-AdminRole" },
                { resourceType: 'ui', resourcePath: "/permission_center", roleName: "DEV-AdminRole" }
            ]
            data = PList.filter(it => it.roleName === currRole).map(it => {
                return {
                    resourceValue: it.resourcePath,
                    resourceType: 'ui',
                }
            })
        }
    async function mockRequest() {
        console.log('请求了mock接口: ', api, arguments, data);
        return Promise.resolve(data)
    }
    !allLogics[api] && (allLogics[api] = mockRequest)
    console.log('createMockLogicService: ', allLogics);
    return allLogics
};