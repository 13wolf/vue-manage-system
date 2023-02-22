<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="query.responsible" placeholder="负责人" class="handle-select mr10" :multiple-limit=3
                    multiple clearable>
                    <el-option v-for="user in users" :key="user.id" :label="user.name" :value="user.name"></el-option>
                </el-select>
                <el-input v-model="query.taskName" placeholder="任务名称" class="handle-input mr10"></el-input>
                <el-date-picker v-model="query.plainDate" type="date" placeholder="计划完成时间" format="YYYY/MM/DD"
                    class="handle-date mr10" />
                <div class="handle-date mr10">
                    <el-date-picker v-model="query.finishDate" type="date" placeholder="实际完成时间" format="YYYY/MM/DD" />
                </div>
                <el-select v-model="query.echelon" placeholder="梯队" class="handle-echelon-select mr10" clearable>
                    <el-option key="1" label="1" value="1"></el-option>
                    <el-option key="2" label="2" value="2"></el-option>
                    <el-option key="3" label="3" value="3"></el-option>
                    <el-option key="4" label="4" value="4"></el-option>
                </el-select>
                <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" :icon="Plus">新增</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                stripe>
                <el-table-column type="index" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="taskName" label="任务名称"></el-table-column>
                <el-table-column prop="responsible" label="负责人"> </el-table-column>
                <el-table-column prop="echelon" label="梯队" align="center">
                </el-table-column>
                <el-table-column prop="plainDate" label="计划完成时间"></el-table-column>
                <el-table-column prop="finishDate" label="实际完成时间"></el-table-column>
                <el-table-column prop="plainDuartion" label="计划工时（人/日）" align="center"></el-table-column>
                <el-table-column prop="checktime" label="审核时间"></el-table-column>
                <el-table-column prop="checkPerson" label="审核人"></el-table-column>
                <el-table-column label="状态" align="center">
                    <template #default="scope">
                        <el-tag
                            :type="scope.row.checkStatus === '1' ? 'success' : scope.row.checkStatus === '2' ? 'danger' : ''">
                            {{ scope.row.checkStatus }}
                        </el-tag>
                    </template>
                </el-table-column>


                <el-table-column label="操作" width="220" align="center">
                    <template #default="scope">
                        <el-button text :icon="Edit" @click="handleEdit(scope.$index, scope.row)" v-permiss="15">
                            编辑
                        </el-button>
                        <el-button text :icon="Delete" class="red" @click="handleDelete(scope.$index)" v-permiss="16">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
                    :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" v-model="editVisible" width="30%">
            <el-form label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveEdit">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="task">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, Plus } from '@element-plus/icons-vue';
import { fetchTask, fetchUsers } from '../../api/index';

interface TaskInfo {
    id: number;
    taskName: string; // 任务名称
    summary: string; // 任务概述
    echelon: number; // 梯队 
    responsible: string; // 负责人
    plainDate: Date; // 计划完成时间
    finishDate: Date; // 实际完成时间
    plainDuartion: number;  // 计划工时（人/日）
    checktime: Date;  // 审核时间
    checkPerson: string;  // 审核人
    checkResult: string;  // 审核情况
    checkStatus: string;  // 审核结果状态（0. 未评审; 1. 通过； 2. 不合格；）
    remark: string;// 说明
    status: string; // 任务状态 （0. 进行中；1. 关闭的；）
    rate: number; // 评分，百分制，目前没有用
    thumb: string;
}

interface User {
    id: number;
    name: string; // 姓名名称
    thumb: string; // 头像
}

// 查询参数存储
const query = reactive({
    taskName: '',
    responsible: '',
    plainDate: '',
    finishDate: '',
    echelon: '',
    pageIndex: 1,
    pageSize: 10
});
const tableData = ref<TaskInfo[]>([]);
const users = ref<User[]>([]);

const pageTotal = ref(0);
// 获取表格数据
const getData = () => {
    fetchTask().then(res => {
        tableData.value = res.data.list;
        pageTotal.value = res.data.pageTotal || 50;
    });
};
getData();

// 获取表格数据
const getUsers = () => {
    fetchUsers().then(res => {
        users.value = res.data.list;
    });
};
getUsers();
// 查询操作
const handleSearch = () => {
    query.pageIndex = 1;
    getData();
};
// 分页导航
const handlePageChange = (val: number) => {
    query.pageIndex = val;
    getData();
};

// 删除操作
const handleDelete = (index: number) => {
    // 二次确认删除
    ElMessageBox.confirm('确定要删除吗？', '提示', {
        type: 'warning'
    })
        .then(() => {
            ElMessage.success('删除成功');
            tableData.value.splice(index, 1);
        })
        .catch(() => { });
};

// 表格编辑时弹窗和保存
const editVisible = ref(false);
let form = reactive({
    name: '',
    address: ''
});
let idx: number = -1;
const handleEdit = (index: number, row: any) => {
    idx = index;
    form.name = row.name;
    form.address = row.address;
    editVisible.value = true;
};
const saveEdit = () => {
    editVisible.value = false;
    ElMessage.success(`修改第 ${idx + 1} 行成功`);
    tableData.value[idx].taskName = form.name;
    tableData.value[idx].summary = form.address;
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 280px;
}

.handle-echelon-select {
    width: 80px;
}

.handle-date {
    display: inline;
    width: 300px;
    padding: 10px;
}

.handle-input {
    width: 300px;
}

.table {
    width: 100%;
    font-size: 14px;
}

.red {
    color: #F56C6C;
}

.mr10 {
    margin-right: 10px;
}

.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
