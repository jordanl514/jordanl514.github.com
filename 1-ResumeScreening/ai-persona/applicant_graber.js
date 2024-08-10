// import fs from 'fs/promises';

export class ApplicantManager {
    async applicantGetter () {
        // Read the applicant_profiles.json file
        try {
            // LOCAL INSTALLATION WIHTOUT SERVER, ONLY FOR TESTING, COMMENT THE FOLLOWING 2 LINES WHEN USING SERVER
            // const data = await fs.readFile('applicant_profiles.json', 'utf8');
            // const applicants = JSON.parse(data);
            // SERVER INSTALLATION, UNCOMMENT THE FOLLOWING 2 LINES
            const response = await fetch('../../ai-persona/applicant_profiles.json');
            const applicants = await response.json();

            // Extract the applicant profiles
            const applicantArray = applicants.applicant.map(applicant => applicant);
            // console.log(applicantArray);

            return applicantArray;
        } catch (err) {
            console.error('Error reading or parsing the file:', err);
            return [];
        }
    }

    async applicantFilter (appArray) {
        const allApplicants = await this.applicantGetter();
        const arrFilteredApplicants = allApplicants.map((applicant, index) => {
            if (appArray[index]) {
                return { ...applicant, ogIndex: index };
            }
        }).filter(applicant => applicant);
    
        let strFilteredApplicants = '';
        arrFilteredApplicants.forEach((applicant) => {
          strFilteredApplicants += `Applicant number: ${applicant.ogIndex + 1}:\n`;
          strFilteredApplicants += `  Name: ${applicant.name}\n`;
          strFilteredApplicants += `  Languages fluent in: ${applicant.langs}\n`;
          strFilteredApplicants += `  Graduation location, graduation year: ${applicant.grad}\n`;
          strFilteredApplicants += `  Gender: ${applicant.gender}\n`;
          strFilteredApplicants += `  Experience: ${applicant.exp}\n`;
          strFilteredApplicants += `  Formal training: ${applicant.training}\n`;
          strFilteredApplicants += `  Skills: ${applicant.skills}\n`;
          strFilteredApplicants += `  Hobby: ${applicant.hobbies}\n`;
          strFilteredApplicants += `\n`;
        });
    
        // console.log(strFilteredApplicants);
        
        return strFilteredApplicants;
    }
}