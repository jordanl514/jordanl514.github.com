import fs from 'fs/promises';

export class ApplicantManager {
    async applicantGetter () {
        // Read the applicant_profiles.json file
        try {
            const data = await fs.readFile('applicant_profiles.json', 'utf8');
            const applicants = JSON.parse(data);

            // Extract the applicant profiles
            const applicantArray = applicants.applicant.map(applicant => applicant);
            // console.log(applicantArray);

            return applicantArray;
        } catch (err) {
            console.error('Error reading or parsing the file:', err);
            return [];
        }
    }
}