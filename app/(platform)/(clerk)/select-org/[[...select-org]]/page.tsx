import { OrganizationList } from '@clerk/nextjs';

function CreateOrganizationPage() {
  return (
    <div>
      {
        <OrganizationList
          hidePersonal
          afterSelectOrganizationUrl='/organization/:id'
          afterCreateOrganizationUrl='/organization/:id'
        />
      }
    </div>
  );
}

export default CreateOrganizationPage;
