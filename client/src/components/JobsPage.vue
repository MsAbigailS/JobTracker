<script>
import { ref, onMounted } from 'vue';
import apiClient from '../api/axios';

export default {
    setup()
    {
        const jobs = ref([]);
        const fields = ref([
            { key: 'role', label: 'Role', sortable: true },
            { key: 'company', label: 'Company', sortable: true },
            { key: 'dateApplied', label: 'Date Applied', sortable: true, formatter: (value) => new Date(value).toLocaleDateString() },
            { key: 'status', label: 'Status', sortable: true },
            { key: 'notes', label: 'Notes' },
            { key: 'location', label: 'Location', sortable: true },
            { key: 'workArrangement', label: 'Work Arrangement', sortable: true },
            { key: 'link', label: 'Post Link', sortable: true },
            { key: 'type', label: 'Job Type', sortable: true },
            { key: 'salaryType', label: 'Salary Type', sortable: true },
            { key: 'salary', label: 'Salary', sortable: true }
        ]);
        const sortBy = ref('role');
        const sortDesc = ref(false);

        const fetchJobs = async () =>
        {
            try
            {
                const response = await apiClient.get('/getJobs');
                console.log('Fetched jobs:', response.data);
                jobs.value = response.data;
            } catch (error)
            {
                console.error('Error fetching jobs:', error);
            }
        };

        onMounted(fetchJobs);

        return { jobs, fields, sortBy, sortDesc };
    }
}

</script>

<template>
    <div id="jobs-page">
        <div id="jobs-header">
            <h1>Jobs</h1>
        </div>
        <div id="jobs-content">
            <b-table hover :items="jobs" :fields="fields" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc"></b-table>
        </div>
    </div>
</template>